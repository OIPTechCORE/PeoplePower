import { Router, Request, Response } from 'express';
import { Pool } from 'pg';
import { 
  WhatsAppMessage, 
  WhatsAppConversation, 
  BusinessProfile, 
  ChatBot, 
  MessageCampaign,
  MessageType,
  MessageStatus,
  MessageCategory
} from '../../../shared/types/communication';

export function createCommunicationRoutes(pool: Pool): Router {
  const router = Router();

  // ==================== CONVERSATIONS ====================
  
  // Get all conversations for a user
  router.get('/conversations', async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const result = await pool.query(
        'SELECT * FROM conversations WHERE participant_ids @> $1 ORDER BY last_message_at DESC',
        [userId]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create new conversation
  router.post('/conversations', async (req: Request, res: Response) => {
    try {
      const { participantIds, type, metadata } = req.body;
      const result = await pool.query(
        `INSERT INTO conversations (participant_ids, type, metadata, created_at, updated_at) 
         VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *`,
        [participantIds, type, metadata]
      );
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get conversation details
  router.get('/conversations/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT * FROM conversations WHERE id = $1',
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Conversation not found' });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==================== MESSAGES ====================
  
  // Get messages for a conversation
  router.get('/conversations/:id/messages', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      const result = await pool.query(
        `SELECT * FROM messages WHERE conversation_id = $1 
         ORDER BY timestamp DESC LIMIT $2 OFFSET $3`,
        [id, limit, offset]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Send message
  router.post('/conversations/:id/messages', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { 
        senderId, 
        recipientId, 
        content, 
        messageType, 
        category, 
        isBusinessMessage,
        mediaAttachments 
      } = req.body;

      const result = await pool.query(
        `INSERT INTO messages (
          conversation_id, sender_id, recipient_id, content, 
          message_type, category, status, timestamp, 
          is_business_message, media_attachments
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9) 
        RETURNING *`,
        [
          id, senderId, recipientId, JSON.stringify(content),
          messageType, category, MessageStatus.SENT, isBusinessMessage,
          JSON.stringify(mediaAttachments || [])
        ]
      );

      // Update conversation last message
      await pool.query(
        'UPDATE conversations SET last_message_at = NOW(), updated_at = NOW() WHERE id = $1',
        [id]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Mark message as read
  router.patch('/messages/:id/read', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      
      const result = await pool.query(
        `UPDATE messages SET status = $1, read_at = NOW() 
         WHERE id = $2 AND recipient_id = $3 RETURNING *`,
        [MessageStatus.READ, id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Message not found' });
      }

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==================== BUSINESS PROFILE ====================
  
  // Get business profile
  router.get('/business-profile/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const result = await pool.query(
        'SELECT * FROM business_profiles WHERE user_id = $1',
        [userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, error: 'Business profile not found' });
      }
      
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create/update business profile
  router.post('/business-profile', async (req: Request, res: Response) => {
    try {
      const { 
        userId, businessName, description, category, 
        address, contactInfo, workingHours, website 
      } = req.body;

      const result = await pool.query(
        `INSERT INTO business_profiles (
          user_id, business_name, description, category, 
          address, contact_info, working_hours, website, 
          is_verified, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, NOW(), NOW()) 
        ON CONFLICT (user_id) DO UPDATE SET
          business_name = EXCLUDED.business_name,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          address = EXCLUDED.address,
          contact_info = EXCLUDED.contact_info,
          working_hours = EXCLUDED.working_hours,
          website = EXCLUDED.website,
          updated_at = NOW()
        RETURNING *`,
        [userId, businessName, description, category, address, contactInfo, workingHours, website]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==================== CHATBOTS ====================
  
  // Get chatbots for a business
  router.get('/chatbots/:businessId', async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const result = await pool.query(
        'SELECT * FROM chatbots WHERE business_id = $1 AND is_active = true',
        [businessId]
      );
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create chatbot
  router.post('/chatbots', async (req: Request, res: Response) => {
    try {
      const { 
        businessId, name, description, personality, 
        responses, triggers, isActive 
      } = req.body;

      const result = await pool.query(
        `INSERT INTO chatbots (
          business_id, name, description, personality, 
          responses, triggers, is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) 
        RETURNING *`,
        [
          businessId, name, description, JSON.stringify(personality),
          JSON.stringify(responses), JSON.stringify(triggers), isActive
        ]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==================== MESSAGE CAMPAIGNS ====================
  
  // Get campaigns for a business
  router.get('/campaigns/:businessId', async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const { status } = req.query;
      
      let query = 'SELECT * FROM message_campaigns WHERE business_id = $1';
      const params = [businessId];
      
      if (status) {
        query += ' AND status = $2';
        params.push(status);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await pool.query(query, params);
      res.json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Create campaign
  router.post('/campaigns', async (req: Request, res: Response) => {
    try {
      const { 
        businessId, name, description, messageContent, 
        targetAudience, schedule, budget, status 
      } = req.body;

      const result = await pool.query(
        `INSERT INTO message_campaigns (
          business_id, name, description, message_content,
          target_audience, schedule, budget, status, 
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) 
        RETURNING *`,
        [
          businessId, name, description, JSON.stringify(messageContent),
          JSON.stringify(targetAudience), JSON.stringify(schedule), 
          JSON.stringify(budget), status
        ]
      );

      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ==================== ANALYTICS ====================
  
  // Get conversation analytics
  router.get('/analytics/conversations/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { period = '7d' } = req.query;
      
      // Get conversation statistics
      const statsResult = await pool.query(
        `SELECT 
          COUNT(*) as total_conversations,
          COUNT(CASE WHEN last_message_at > NOW() - INTERVAL '7 days' THEN 1 END) as active_conversations,
          COUNT(CASE WHEN type = 'business' THEN 1 END) as business_conversations,
          COUNT(CASE WHEN type = 'personal' THEN 1 END) as personal_conversations
        FROM conversations WHERE participant_ids @> $1`,
        [userId]
      );

      // Get message statistics
      const messageStatsResult = await pool.query(
        `SELECT 
          COUNT(*) as total_messages,
          COUNT(CASE WHEN sender_id = $1 THEN 1 END) as sent_messages,
          COUNT(CASE WHEN recipient_id = $1 THEN 1 END) as received_messages,
          COUNT(CASE WHEN status = 'read' AND recipient_id = $1 THEN 1 END) as read_messages
        FROM messages WHERE sender_id = $1 OR recipient_id = $1`,
        [userId]
      );

      res.json({ 
        success: true, 
        data: {
          conversationStats: statsResult.rows[0],
          messageStats: messageStatsResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get business analytics
  router.get('/analytics/business/:businessId', async (req: Request, res: Response) => {
    try {
      const { businessId } = req.params;
      const { period = '30d' } = req.query;
      
      // Get business message statistics
      const businessStatsResult = await pool.query(
        `SELECT 
          COUNT(*) as total_business_messages,
          COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_messages,
          COUNT(CASE WHEN status = 'read' THEN 1 END) as read_messages,
          COUNT(CASE WHEN reactions IS NOT NULL THEN 1 END) as messages_with_reactions
        FROM messages 
        WHERE is_business_message = true AND sender_id = $1`,
        [businessId]
      );

      // Get campaign statistics
      const campaignStatsResult = await pool.query(
        `SELECT 
          COUNT(*) as total_campaigns,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_campaigns,
          SUM((budget->>'total')::numeric) as total_budget_spent
        FROM message_campaigns WHERE business_id = $1`,
        [businessId]
      );

      res.json({ 
        success: true, 
        data: {
          businessStats: businessStatsResult.rows[0],
          campaignStats: campaignStatsResult.rows[0]
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  return router;
}
