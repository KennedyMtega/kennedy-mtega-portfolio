# Supabase Database Documentation

## Connection Details
- **Project URL**: https://jxcfjnnknwwnmmbhthup.supabase.co
- **Project Reference**: jxcfjnnknwwnmmbhthup

## Important Note
This database and dashboard are exclusively for admin use. Authentication is handled through existing credentials.

## Current Database Structure

### Tables

#### 1. projects
- **Description**: Portfolio projects showcase
- **Columns**:
  - `id`: uuid (primary key)
  - `title`: text
  - `slug`: text (unique)
  - `short_description`: text
  - `full_description`: text
  - `technologies`: array
  - `project_url`: text
  - `github_url`: text
  - `image_url`: text
  - `preview_image_url`: text
  - `featured`: boolean
  - `order_index`: integer
  - `created_at`: timestamp with time zone
  - `updated_at`: timestamp with time zone

#### 2. blog_posts
- **Description**: Blog articles and content
- **Columns**:
  - `id`: uuid (primary key)
  - `title`: text
  - `slug`: text (unique)
  - `excerpt`: text
  - `content`: text
  - `author`: text
  - `category`: text
  - `tags`: array
  - `image_url`: text
  - `published`: boolean
  - `featured`: boolean
  - `created_at`: timestamp with time zone
  - `updated_at`: timestamp with time zone
  - `published_at`: timestamp with time zone
  - `subheading`: text

## Storage Configuration

### Bucket: portfolio
- **Name**: portfolio
- **Access**: Public
- **Created**: March 10, 2025
- **Configuration**:
  - No file size limits set
  - No MIME type restrictions
  - Public access enabled

## API Access

### REST Endpoints
Available at: `https://jxcfjnnknwwnmmbhthup.supabase.co/rest/v1/`

#### Projects Endpoints
- GET `/projects` - List all projects
- GET `/projects/{id}` - Get a specific project
- POST `/projects` - Create a new project
- PATCH `/projects/{id}` - Update a project
- DELETE `/projects/{id}` - Delete a project

#### Blog Posts Endpoints
- GET `/blog_posts` - List all blog posts
- GET `/blog_posts/{id}` - Get a specific blog post
- POST `/blog_posts` - Create a new blog post
- PATCH `/blog_posts/{id}` - Update a blog post
- DELETE `/blog_posts/{id}` - Delete a blog post

### Storage API
Available at: `https://jxcfjnnknwwnmmbhthup.supabase.co/storage/v1/`

#### Portfolio Bucket Operations
- GET `/object/public/portfolio/{path}` - Access files
- POST `/object/portfolio/{path}` - Upload files
- DELETE `/object/portfolio/{path}` - Delete files

## Planned/Missing Components

### Tables to be Implemented
1. **messages**
   - Contact form submissions
   - Message management system

### Storage Improvements
Consider implementing:
- File size limits
- MIME type restrictions
- Separate buckets for different content types (blog images, project images)

## Next Steps

1. **Database**
   - Implement the messages table
   - Add necessary indexes for performance

2. **Storage**
   - Set up file size limits
   - Configure MIME type restrictions
   - Consider splitting into specific buckets

---

**Note**: This documentation reflects the current state of the Supabase implementation as of the last inspection. Any changes made after this inspection will need to be documented separately. 