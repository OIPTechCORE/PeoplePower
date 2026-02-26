-- CREATE SUPER ADMIN ACCOUNT
-- Run this SQL in your PostgreSQL database to create the Super Admin user

-- First, ensure the table exists (it should from migration 012)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'super_admin_dashboard') THEN
        RAISE NOTICE 'Table super_admin_dashboard does not exist. Please run migration 012 first.';
    ELSE
        -- Insert Super Admin account
        INSERT INTO super_admin_dashboard (
            admin_id,
            username,
            email,
            role_level,
            session_token,
            biometric_hash,
            is_active,
            last_login_at,
            created_at,
            updated_at
        ) VALUES (
            'admin_001',
            'superadmin',
            'admin@peoplepower.com',
            'GOD_LEVEL',
            'super_admin_session_token_12345',
            'biometric_hash_secure_67890',
            true,
            NOW(),
            NOW(),
            NOW()
        ) ON CONFLICT (admin_id) DO UPDATE SET
            username = EXCLUDED.username,
            email = EXCLUDED.email,
            session_token = EXCLUDED.session_token,
            biometric_hash = EXCLUDED.biometric_hash,
            updated_at = NOW();
        
        RAISE NOTICE 'Super Admin account created successfully!';
        RAISE NOTICE 'Admin ID: admin_001';
        RAISE NOTICE 'Username: superadmin';
        RAISE NOTICE 'Email: admin@peoplepower.com';
    END IF;
END $$;

-- Verify the account was created
SELECT * FROM super_admin_dashboard WHERE admin_id = 'admin_001';
