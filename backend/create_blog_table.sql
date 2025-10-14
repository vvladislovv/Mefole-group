-- Create blog_submissions table
CREATE TABLE IF NOT EXISTS blog_submissions (
    id SERIAL PRIMARY KEY,
    project_type VARCHAR(255) NOT NULL,
    project_description TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    business_goals TEXT NOT NULL,
    platform VARCHAR(255) NOT NULL,
    integrations TEXT NOT NULL,
    design_requirements TEXT NOT NULL,
    performance_requirements TEXT NOT NULL,
    budget VARCHAR(255) NOT NULL,
    timeline VARCHAR(255) NOT NULL,
    priority_features TEXT NOT NULL,
    additional_services TEXT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email
CREATE INDEX IF NOT EXISTS idx_blog_submissions_email ON blog_submissions(email);

-- Create index for created_at
CREATE INDEX IF NOT EXISTS idx_blog_submissions_created_at ON blog_submissions(created_at);
