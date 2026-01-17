# GAK Dashboard - Features List

Based on the Prisma schema, here are the features that need to be implemented:

## 1. Authentication ✅ (Completed)
- User registration and sign in
- Session management
- Email/password authentication
- Protected routes with layout-based access control

## 2. Content Management (Reflections/Blog)
- **Reflection Management**
  - Create, edit, delete reflections
  - Rich text content editor
  - Draft and published status management
  - Publish date scheduling
  - URL slug generation
  - Author attribution

- **Tag Management**
  - Create and manage tags
  - Tag slug generation
  - Assign multiple tags to reflections
  - Filter reflections by tags

- **Featured Images**
  - Upload and assign featured images to reflections
  - Image metadata (dimensions, size, captions)

## 3. Media Management (Albums & Images)
- **Album Management**
  - Create, edit, delete albums
  - Album descriptions
  - Date tracking
  - User attribution (uploaded by)

- **Image Management**
  - Upload images to albums
  - Image metadata (width, height, size, alt text, captions)
  - Organize images within albums
  - Standalone images (not in albums)

## 4. Contact Form Management
- View contact submissions
- Submission status tracking (NEW, REVIEWED, ARCHIVED)
- Filter submissions by status
- Respond to submissions
- Contact information display (name, email, phone, subject, message)

## 5. Congregation Management
- **Member Profiles**
  - Create, edit, delete congregation members
  - Name and title management
  - Birthday tracking
  - WhatsApp number management (unique)
  - Address information
  - Member status (active/inactive)

- **Member Search & Filter**
  - Search by name
  - Filter by status
  - Filter by age groups

## 6. Attendance Tracking
- **Sermon Sessions**
  - Create and manage sermon sessions
  - Session naming and organization

- **Attendance Recording**
  - Record attendance for congregation members
  - Date-based attendance tracking
  - Unique attendance records (congregation + session + date)
  - View attendance history

- **Attendance Reports**
  - View attendance by session
  - View attendance by congregation member
  - Attendance statistics and trends

## 7. Inventory Management
- **Inventory Items**
  - Create, edit, delete inventory items
  - Categories: Sound System, Multimedia, Other
  - Quantity tracking
  - Price tracking
  - Purchase date tracking
  - Status management: Good, Damaged, Maintenance, Disposed

- **Inventory Inspections**
  - Create inspection records
  - Update item status after inspection
  - Inspection date tracking

- **Inventory Maintenance**
  - Create maintenance records
  - Maintenance status: Ongoing, Completed
  - Cost tracking
  - Quantity affected
  - Maintenance descriptions

- **Inventory Reports**
  - View inventory by category
  - View inventory by status
  - Maintenance history
  - Inspection history
  - Low stock alerts

## 8. Dashboard Overview
- Quick statistics
  - Total congregation members
  - Recent attendance
  - Inventory status summary
  - Recent reflections
  - Pending contact submissions

- Quick actions
  - Add new congregation member
  - Record attendance
  - Create new reflection
  - Add inventory item

## 9. User Profile Management
- View and edit user profile
- Update name and email
- Profile image management
- Account settings

## 10. Admin Features (Future)
- User management (if multiple users)
- Role-based access control
- Activity logs
- System settings
- Backup and restore
