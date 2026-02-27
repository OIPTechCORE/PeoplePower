-- Unified Marketplace Migration
-- Creates tables for the super futuristic unified marketplace system

-- Marketplace Items Table
CREATE TABLE IF NOT EXISTS marketplace_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL REFERENCES players(id),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('gaming', 'digital', 'physical', 'services', 'exclusive')),
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')),
    icon VARCHAR(10) DEFAULT '📦',
    image TEXT,
    is_available BOOLEAN DEFAULT true,
    is_limited BOOLEAN DEFAULT false,
    stock INTEGER DEFAULT 1 CHECK (stock >= 0),
    max_stock INTEGER DEFAULT 1 CHECK (max_stock > 0),
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    reviews INTEGER DEFAULT 0 CHECK (reviews >= 0),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Marketplace Purchases Table
CREATE TABLE IF NOT EXISTS marketplace_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES players(id),
    seller_id UUID NOT NULL REFERENCES players(id),
    item_id UUID NOT NULL REFERENCES marketplace_items(id),
    price DECIMAL(10,2) NOT NULL,
    platform_fee DECIMAL(10,2) NOT NULL,
    seller_amount DECIMAL(10,2) NOT NULL,
    transaction_hash VARCHAR(66),
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Cart Table
CREATE TABLE IF NOT EXISTS user_carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES players(id),
    item_id UUID NOT NULL REFERENCES marketplace_items(id),
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

-- Marketplace Categories Table
CREATE TABLE IF NOT EXISTS marketplace_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO marketplace_categories (name, description, icon, sort_order) VALUES
('gaming', 'In-game items and virtual goods', '🎮', 1),
('digital', 'Digital products and services', '💻', 2),
('physical', 'Physical products and merchandise', '📦', 3),
('services', 'Professional services and consultations', '🛠️', 4),
('exclusive', 'Limited edition and exclusive items', '⭐', 5)
ON CONFLICT (name) DO NOTHING;

-- Marketplace Analytics Table
CREATE TABLE IF NOT EXISTS marketplace_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES players(id),
    item_id UUID REFERENCES marketplace_items(id),
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured Listings Table
CREATE TABLE IF NOT EXISTS featured_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Marketplace Reviews Table
CREATE TABLE IF NOT EXISTS marketplace_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES marketplace_items(id),
    reviewer_id UUID NOT NULL REFERENCES players(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(item_id, reviewer_id)
);

-- Marketplace Notifications Table
CREATE TABLE IF NOT EXISTS marketplace_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES players(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_items_seller_id ON marketplace_items(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_rarity ON marketplace_items(rarity);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_price ON marketplace_items(price);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_available ON marketplace_items(is_available);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_created_at ON marketplace_items(created_at);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_tags ON marketplace_items USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_buyer_id ON marketplace_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_seller_id ON marketplace_purchases(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_item_id ON marketplace_purchases(item_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_created_at ON marketplace_purchases(created_at);

CREATE INDEX IF NOT EXISTS idx_user_carts_user_id ON user_carts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_carts_item_id ON user_carts(item_id);

CREATE INDEX IF NOT EXISTS idx_marketplace_analytics_event_type ON marketplace_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_marketplace_analytics_user_id ON marketplace_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_analytics_created_at ON marketplace_analytics(created_at);

CREATE INDEX IF NOT EXISTS idx_featured_listings_item_id ON featured_listings(item_id);
CREATE INDEX IF NOT EXISTS idx_featured_listings_active ON featured_listings(is_active);
CREATE INDEX IF NOT EXISTS idx_featured_listings_dates ON featured_listings(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_item_id ON marketplace_reviews(item_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_reviewer_id ON marketplace_reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_rating ON marketplace_reviews(rating);

CREATE INDEX IF NOT EXISTS idx_marketplace_notifications_user_id ON marketplace_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_notifications_type ON marketplace_notifications(type);
CREATE INDEX IF NOT EXISTS idx_marketplace_notifications_read ON marketplace_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_marketplace_notifications_created_at ON marketplace_notifications(created_at);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_marketplace_items_updated_at 
    BEFORE UPDATE ON marketplace_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries
CREATE OR REPLACE VIEW marketplace_items_with_seller AS
SELECT 
    mi.*,
    p.username as seller_username,
    p.display_name as seller_display_name,
    p.rating as seller_rating,
    p.avatar as seller_avatar
FROM marketplace_items mi
JOIN players p ON mi.seller_id = p.id;

CREATE OR REPLACE VIEW marketplace_purchase_details AS
SELECT 
    mp.*,
    mi.name as item_name,
    mi.icon as item_icon,
    mi.image as item_image,
    mi.category as item_category,
    mi.rarity as item_rarity,
    buyer.username as buyer_username,
    buyer.display_name as buyer_display_name,
    seller.username as seller_username,
    seller.display_name as seller_display_name
FROM marketplace_purchases mp
JOIN marketplace_items mi ON mp.item_id = mi.id
JOIN players buyer ON mp.buyer_id = buyer.id
JOIN players seller ON mp.seller_id = seller.id;

-- Functions for marketplace operations
CREATE OR REPLACE FUNCTION calculate_marketplace_stats()
RETURNS TABLE(
    total_items BIGINT,
    active_items BIGINT,
    total_value DECIMAL,
    average_price DECIMAL,
    total_sales BIGINT,
    total_revenue DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM marketplace_items) as total_items,
        (SELECT COUNT(*) FROM marketplace_items WHERE is_available = true) as active_items,
        (SELECT COALESCE(SUM(price), 0) FROM marketplace_items) as total_value,
        (SELECT COALESCE(AVG(price), 0) FROM marketplace_items) as average_price,
        (SELECT COUNT(*) FROM marketplace_purchases WHERE status = 'completed') as total_sales,
        (SELECT COALESCE(SUM(seller_amount), 0) FROM marketplace_purchases WHERE status = 'completed') as total_revenue;
END;
$$ LANGUAGE plpgsql;
