-- ============================================
-- Y4D Community Help & Resource Hub
-- Initial Database Schema
-- ============================================

-- 1. USERS
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 2. HELP REQUESTS
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    location VARCHAR(200),
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT requests_status_check
        CHECK (status IN ('open', 'in_progress', 'resolved'))
);


-- 3. MEDIA ASSOCIATED WITH REQUESTS
-- Actual files will eventually live in AWS S3.
-- This table stores their metadata and S3 URL.
CREATE TABLE request_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- 4. VOLUNTEERS
-- Connects users with requests they volunteered for.
CREATE TABLE volunteers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_request_volunteer
        UNIQUE (request_id, user_id)
);


-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_requests_created_by
    ON requests(created_by);

CREATE INDEX idx_requests_category
    ON requests(category);

CREATE INDEX idx_requests_status
    ON requests(status);

CREATE INDEX idx_requests_created_at
    ON requests(created_at);

CREATE INDEX idx_request_media_request_id
    ON request_media(request_id);

CREATE INDEX idx_volunteers_request_id
    ON volunteers(request_id);

CREATE INDEX idx_volunteers_user_id
    ON volunteers(user_id);