const PERMISSIONS = {
  ADMIN: [
    'access_admin_dashboard',
    'manage_users',
    'manage_projects',
    'manage_seo',
    'manage_cms',
    'manage_orders',
    'manage_payments',
    'manage_settings'
  ],
  USER: [
    'access_user_dashboard',
    'view_profile',
    'view_own_orders',
    'manage_cart',
    'access_referrals'
  ]
};

module.exports = { PERMISSIONS };