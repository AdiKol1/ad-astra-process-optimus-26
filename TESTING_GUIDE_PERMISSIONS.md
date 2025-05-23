# Testing Guide: Advanced Permissions System

## 🚀 Quick Start Testing

### **Application Access**
- **URL**: http://localhost:4005
- **Admin Login**: http://localhost:4005/admin/login

### **Test Credentials**
- **Super Admin**: admin@adastra.com / admin123
- **Regular Admin**: test@adastra.com / admin123

---

## 🧪 Comprehensive Testing Checklist

### **1. Authentication & Basic Access**

#### ✅ Login Testing
- [ ] **Super Admin Login**
  - Navigate to http://localhost:4005/admin/login
  - Use: admin@adastra.com / admin123
  - Should redirect to dashboard with crown icon
  - Role badge should show "Super Admin"

- [ ] **Regular Admin Login**
  - Use: test@adastra.com / admin123
  - Should redirect to dashboard with appropriate role icon
  - Role badge should show assigned role level

#### ✅ Dashboard Navigation
- [ ] **Super Admin Navigation**
  - Should see all menu items: Overview, Leads, Analytics, Settings, User Management, Role Management
  - All navigation links should be accessible

- [ ] **Regular Admin Navigation**
  - Should see limited menu items based on role permissions
  - User Management and Role Management may not be visible

### **2. Permission System Testing**

#### ✅ Role Display
- [ ] **User Info Section**
  - Role badge displays correct level and color
  - Icon matches role level (Crown, Shield, UserCog, etc.)
  - Multiple roles shown when applicable

- [ ] **Permission Summary**
  - Can access permission summary from user menu
  - Shows all active roles
  - Displays permission count by category
  - Expandable details work correctly

#### ✅ Role-Based Navigation
- [ ] **Permission Guards**
  - Navigation items appear/disappear based on user permissions
  - Fallback content shows for restricted areas
  - Debug mode can be enabled for testing

### **3. Role Management Interface**

#### ✅ Accessing Role Management
- [ ] **Super Admin Access**
  - Role Management appears in navigation
  - Can access http://localhost:4005/dashboard/roles
  - Page loads with role cards and statistics

- [ ] **Permission Restricted Access**
  - Users without `permissions_manage` permission see access denied
  - Fallback message displays correctly

#### ✅ Role Management Features
- [ ] **View Roles**
  - All system roles display (Super Admin, Admin Manager, Lead Manager, Analyst, Viewer)
  - Custom roles (if any) display correctly
  - Role cards show level, description, creation date
  - System roles marked with "System" badge

- [ ] **View Role Permissions**
  - Click eye icon on any role card
  - Permission modal opens showing categorized permissions
  - Permissions grouped by category (dashboard, leads, users, analytics, settings)
  - Green checkmarks indicate granted permissions

#### ✅ Custom Role Creation
- [ ] **Create New Role**
  - Click "Create Role" button
  - Modal opens with form fields
  - Fill in: Name, Display Name, Description, Level (1-99), Color
  - Select permissions by category
  - Save successfully creates role

- [ ] **Edit Custom Role**
  - Click edit icon on custom role (not system role)
  - Form pre-populates with existing data
  - Can modify display name, description, level, color
  - Can change permission assignments
  - System roles show disabled form fields

- [ ] **Delete Custom Role**
  - Click trash icon on custom role
  - Confirmation dialog appears
  - Deletion removes role from list
  - System roles don't show delete option

### **4. User Management Integration**

#### ✅ User Role Assignment
- [ ] **Access User Management**
  - Navigate to User Management (if permitted)
  - Should show updated interface with role assignments

- [ ] **Role Assignment**
  - Edit user should show role selection
  - Multiple roles can be assigned
  - Role changes reflect immediately in user's permissions

### **5. Permission Enforcement Testing**

#### ✅ Component-Level Guards
- [ ] **Dashboard Access**
  - Users with `dashboard_view` can see overview
  - Users without permission see fallback or redirect

- [ ] **Leads Management**
  - Users with `leads_view` can access leads list
  - Users with `leads_create` can add new leads
  - Users with `leads_update` can edit existing leads
  - Users with `leads_delete` can remove leads

- [ ] **Analytics Access**
  - Users with `analytics_view` can see analytics
  - Advanced features require `analytics_advanced`
  - Export features require `analytics_export`

#### ✅ API Permission Checking
- [ ] **Service Layer**
  - API calls respect user permissions
  - Unauthorized actions return appropriate errors
  - Permission changes reflect immediately

### **6. Database Integration Testing**

#### ✅ Permission Functions
- [ ] **Database Functions Work**
  - `user_has_permission()` returns correct boolean
  - `get_user_permissions()` returns user's effective permissions
  - `get_user_roles()` returns user's active roles

- [ ] **Role Hierarchy**
  - Higher level roles inherit appropriate permissions
  - Permission conflicts resolved correctly
  - Role expiration dates honored (if set)

#### ✅ Data Integrity
- [ ] **Referential Integrity**
  - Cannot delete roles assigned to users
  - Cannot delete permissions assigned to roles
  - Cascade deletes work correctly

- [ ] **Security Constraints**
  - Cannot create duplicate role-permission assignments
  - Cannot create users with invalid role assignments
  - RLS policies enforced correctly

### **7. Performance & UX Testing**

#### ✅ Loading States
- [ ] **Permission Loading**
  - Loading indicators appear while fetching permissions
  - Permissions cache correctly between navigations
  - No excessive API calls

- [ ] **Real-time Updates**
  - Role changes reflect immediately
  - Permission changes update UI without refresh
  - Multiple role assignments display correctly

#### ✅ Error Handling
- [ ] **Permission Errors**
  - Clear error messages for unauthorized access
  - Graceful fallbacks for missing permissions
  - Network errors handled appropriately

### **8. Advanced Features Testing**

#### ✅ Permission Categories
- [ ] **Category Organization**
  - Permissions properly grouped by category
  - Categories display correctly in role management
  - Permission counts accurate

#### ✅ System Role Protection
- [ ] **System Role Immutability**
  - System roles cannot be edited (fields disabled)
  - System roles cannot be deleted (no delete button)
  - System role permissions cannot be modified

#### ✅ Multi-Role Support
- [ ] **Multiple Roles**
  - Users can have multiple active roles
  - Permissions combine correctly from all roles
  - Highest role level determines overall access
  - Role badges display multiple roles appropriately

---

## 🐛 Common Issues & Troubleshooting

### **Issue: Navigation Items Not Appearing**
- **Solution**: Check user has required permissions
- **Debug**: Enable debug mode in PermissionGuard
- **Verify**: Check console for permission check logs

### **Issue: Role Management Not Accessible**
- **Solution**: Ensure user has `permissions_manage` permission
- **Check**: Verify user role assignments in database
- **Test**: Try with super admin account

### **Issue: Permissions Not Loading**
- **Solution**: Check network tab for API calls
- **Verify**: Database migrations applied correctly
- **Debug**: Check browser console for errors

### **Issue: Role Assignments Not Working**
- **Solution**: Verify database foreign key constraints
- **Check**: Ensure roles and users exist
- **Debug**: Check API responses for error messages

---

## 📊 Expected Test Results

### **Super Admin (admin@adastra.com)**
- ✅ All navigation items visible
- ✅ All permissions granted (25+ permissions)
- ✅ Can access role management
- ✅ Can create/edit/delete custom roles
- ✅ Role badge shows "Super Admin" with crown icon

### **Lead Manager (test@adastra.com)**
- ✅ Basic navigation visible (Overview, Leads, Analytics, Settings)
- ✅ Lead management permissions granted
- ✅ Analytics view permissions granted
- ❌ Cannot access user management
- ❌ Cannot access role management
- ✅ Role badge shows "Lead Manager" with appropriate icon

---

## 🎯 Success Criteria

The advanced permissions system is working correctly if:

1. **✅ All role-based navigation works**
2. **✅ Permission guards protect components**
3. **✅ Role management interface functions**
4. **✅ Database permissions enforce correctly**
5. **✅ User experience is intuitive**
6. **✅ Security constraints are enforced**
7. **✅ Performance is acceptable**
8. **✅ Error handling is graceful**

---

## 🚀 Next Enhancement Ready

Once all tests pass, the system is ready for:
**Enhancement #5: Email Notifications System**

This will add:
- Email templates and sending
- Notification preferences
- Event-driven email triggers
- Email delivery tracking
- Template management interface 