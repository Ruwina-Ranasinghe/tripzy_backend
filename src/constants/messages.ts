export class ErrorMessages {
    // Authentication & Authorization
    public static USER_NOT_FOUND = "User not found";
    public static INVALID_CREDENTIALS = "Invalid email or password";
    public static USER_ALREADY_EXIST = "User already exist";
    public static UNAUTHORIZED_ACCESS = "Unauthorized access";
    public static TOKEN_EXPIRED = "Authentication token has expired";
    public static INVALID_TOKEN = "Invalid authentication token";
    public static EMAIL_NOT_FOUND = "Email not found";
    public static REFRESH_TOKEN_NOT_FOUND = "Refresh token not found";
    public static AUTHENTICATION_FAILED = "Authentication Failed || JWT Expired";
    public static AUTHORIZATION_FAILED = "Authorization Failed";
    public static AUTHORIZATION_HEADER_NOT_SET = "Authorization header not set";
    public static BEARER_PREFIX_NOT_FOUND = "Prefix \"Bearer\" is not found in authorization header";
    public static BEARER_TOKEN_NOT_FOUND = "Bearer Token not found";
    public static USER_DELETED = "Authentication Failed - User Deleted";

    // Input Validation
    public static INVALID_INPUT = "Invalid input parameters";
    public static MISSING_REQUIRED_FIELDS = "Required fields are missing";
    public static INVALID_FORMAT = "Invalid data format";
    public static VALIDATION_ERROR = "Validation failed";

    // Resource Operations
    public static RESOURCE_NOT_FOUND = "Requested resource not found";
    public static RESOURCE_ALREADY_EXISTS = "Resource already exists";
    public static RESOURCE_CREATION_FAILED = "Failed to create resource";
    public static RESOURCE_UPDATE_FAILED = "Failed to update resource";
    public static RESOURCE_DELETION_FAILED = "Failed to delete resource";

    // Database Operations
    public static DATABASE_ERROR = "Database operation failed";
    public static CONNECTION_ERROR = "Database connection error";
    public static QUERY_ERROR = "Error executing database query";

    // API Related
    public static API_ERROR = "API request failed";
    public static RATE_LIMIT_EXCEEDED = "Rate limit exceeded";
    public static SERVICE_UNAVAILABLE = "Service is temporarily unavailable";
    public static TIMEOUT_ERROR = "Request timed out";

    // File Operations
    public static FILE_UPLOAD_ERROR = "File upload failed";
    public static FILE_NOT_FOUND = "File not found";
    public static INVALID_FILE_TYPE = "Invalid file type";
    public static FILE_TOO_LARGE = "File size exceeds limit";

    // Business Logic
    public static INSUFFICIENT_PERMISSIONS = "Insufficient permissions";
    public static OPERATION_NOT_ALLOWED = "Operation not allowed";
    public static BUSINESS_RULE_VIOLATION = "Business rule violation";

    // User Operations
    public static LOGOUT_UNSUCCESSFUL = "Logout unsuccessful";
    public static USER_VERIFICATION_FAILED = "User verification failed";

    // Role Operations
    public static ROLE_ALREADY_EXISTS = "Role already exists";
    public static ROLE_NOT_FOUND = "Role not found";

    // Token Operations
    public static TOKEN_NOT_FOUND = "Token not found";
    public static INVALID_REFRESH_TOKEN = "Invalid refresh token";
    public static EXPIRED_REFRESH_TOKEN = "Expired refresh token";
    public static REFRESH_TOKEN_SYSTEM_ERROR = "Refresh token not found in system. Unable to issue access token";
    public static TOKEN_GENERATION_FAILED = "Token generation failed";

    // General
    public static INTERNAL_SERVER_ERROR = "Internal server error";
    public static NOT_IMPLEMENTED = "Feature not implemented";
    public static INVALID_OPERATION = "Invalid operation";
}

export class InfoMessages {
    // Authentication & Authorization
    public static USER_SIGNUP_STARTED = "User signup started";
    public static USER_SIGNUP_SUCCESSFUL = "User signup successful";
    public static USER_LOGIN_STARTED = "User login started";
    public static USER_LOGIN_SUCCESSFUL = "User login successful";
    public static USER_TOKEN_REFRESH_STARTED = "User token refresh started";
    public static USER_TOKEN_REFRESH_SUCCESSFUL = "User token refresh successful";
    public static USER_LOGOUT_STARTED = "User login out";
    public static USER_VERIFYING = "User verifying";
    public static USER_UPDATE_STARTED = "User update started";
    public static USER_UPDATE_SUCCESSFUL = "User update successful";
    public static GOOGLE_LOGIN_STARTED = "Google login started";
    public static GOOGLE_LOGIN_SUCCESSFUL = "Google login successful";
    public static APPLE_LOGIN_STARTED = "Apple login started";
    public static APPLE_LOGIN_SUCCESSFUL = "Apple login successful";

    // Admin Authentication & Authorization
    public static ADMIN_SIGNUP_STARTED = "Admin signup started";
    public static ADMIN_SIGNUP_SUCCESSFUL = "Admin signup successful";
    public static ADMIN_LOGIN_STARTED = "Admin login started";
    public static ADMIN_LOGIN_SUCCESSFUL = "Admin login successful";
    public static ADMIN_TOKEN_REFRESH_STARTED = "Admin token refresh started";
    public static ADMIN_TOKEN_REFRESH_SUCCESSFUL = "Admin token refresh successful";
    public static ADMIN_LOGOUT_STARTED = "Admin logout started";
    public static ADMIN_UPDATE_STARTED = "Admin update started";
    public static ADMIN_UPDATE_SUCCESSFUL = "Admin update successful";
    public static ADMIN_PASSWORD_CHANGE_STARTED = "Admin password change started";
    public static ADMIN_PASSWORD_CHANGE_SUCCESSFUL = "Admin password change successful";
    public static ADMIN_LIST_REQUESTED = "Admin list requested";
    public static ADMIN_LIST_SENT = "Admin list sent";
    public static ADMIN_DETAILS_REQUESTED = "Admin details requested";
    public static ADMIN_DETAILS_SENT = "Admin details sent";
    public static ADMIN_LOGGED_IN_DETAILS_REQUESTED = "Logged in admin details requested";
    public static ADMIN_LOGGED_IN_DETAILS_SUCCESSFUL = "Logged in admin details received successfully";

    // Permission Management
    public static PERMISSION_LIST_REQUESTED = "Retrieving all permissions";
    public static PERMISSION_LIST_SENT = "All permissions retrieved successfully";
    public static PERMISSION_CREATE_STARTED = "Creating permission";
    public static PERMISSION_CREATE_SUCCESSFUL = "Permission created successfully";
    public static PERMISSION_UPDATE_STARTED = "Updating permission";
    public static PERMISSION_UPDATE_SUCCESSFUL = "Permission updated successfully";
    public static PERMISSION_DETAILS_REQUESTED = "Finding permission by id";
    public static PERMISSION_DETAILS_SENT = "Permission details retrieved successfully";
    public static PERMISSION_GROUP_REQUESTED = "Finding permissions by group";
    public static PERMISSION_GROUP_SENT = "Permissions by group retrieved successfully";

    // Role Management
    public static ROLE_LIST_REQUESTED = "Retrieving all roles";
    public static ROLE_LIST_SENT = "All roles retrieved successfully";
    public static ROLE_FILTERED_LIST_REQUESTED = "Retrieving roles by filters";
    public static ROLE_FILTERED_LIST_SENT = "Filtered roles retrieved successfully";
    public static ROLE_PAGED_LIST_REQUESTED = "Retrieving paged roles";
    public static ROLE_PAGED_LIST_SENT = "Paged roles retrieved successfully";
    public static ROLE_CREATE_STARTED = "Creating role";
    public static ROLE_CREATE_SUCCESSFUL = "Role created successfully";
    public static ROLE_UPDATE_STARTED = "Updating role";
    public static ROLE_UPDATE_SUCCESSFUL = "Role updated successfully";
    public static ROLE_DELETE_STARTED = "Deleting role";
    public static ROLE_DELETE_SUCCESSFUL = "Role deleted successfully";
    public static ROLE_DETAILS_REQUESTED = "Finding role by id";
    public static ROLE_DETAILS_SENT = "Role details retrieved successfully";
    public static ROLE_PERMISSIONS_REQUESTED = "Retrieving all permissions for role";
    public static ROLE_PERMISSIONS_SENT = "Role permissions retrieved successfully";

    // Token Management
    public static TOKEN_GENERATION_STARTED = "Token generation started";
    public static TOKEN_GENERATION_SUCCESSFUL = "Token generated successfully";
    public static TOKEN_REFRESH_STARTED = "Token refresh started";
    public static TOKEN_REFRESH_SUCCESSFUL = "Token refreshed successfully";
    public static TOKEN_VALIDATION_STARTED = "Token validation started";
    public static TOKEN_VALIDATION_SUCCESSFUL = "Token validation successful";
    public static JWT_VERIFIED = "Jwt verified";

    // File Management
    public static FILE_UPLOAD_STARTED = "File upload started";
    public static FILE_UPLOAD_SUCCESSFUL = "File uploaded successfully";
    public static FILE_DOWNLOAD_STARTED = "File download started";
    public static FILE_DOWNLOAD_SUCCESSFUL = "File downloaded successfully";
    public static FILE_DELETE_STARTED = "File deletion started";
    public static FILE_DELETE_SUCCESSFUL = "File deleted successfully";

    // System Management
    public static SYSTEM_PARAMS_UPDATE_STARTED = "System update started";
    public static SYSTEM_PARAMS_UPDATE_SUCCESSFUL = "Updating system params Completed";
    public static FETCHING_SYSTEM_PARAMS_BY_CODE = "Fetching system params by code";
    public static FETCHING_SYSTEM_PARAMS_BY_CODE_SUCCESSFUL = "Fetching system params by code successful";

    //BlackoutDates Management
    public static BLACKOUT_DATE_CREATE_STARTED = "Date create started";
    public static BLACKOUT_DATE_CREATE_SUCCESSFUL = "Creating blackout date Completed";
    public static BLACKOUT_DATE_UPDATE_STARTED = "Date update started";
    public static BLACKOUT_DATE_UPDATE_SUCCESSFUL = "Updating blackout date Completed";
    public static FETCHING_BLACKOUT_DATE_BY_ID = "Fetching blackoutDates by id";
    public static FETCHING_BLACKOUT_DATE_BY_ID_SUCCESSFUL = "Fetching blackoutDates by id successful";
    public static FETCHING_BLACKOUT_DATES = "Fetching blackoutDates";
    public static FETCHING_BLACKOUT_DATES_SUCCESSFUL = "Fetching blackoutDates successful";
    public static BLACKOUT_DATE_DELETE_STARTED = "Date delete started";
    public static BLACKOUT_DATE_DELETE_SUCCESSFUL = "Deleting blackout date Completed";

    // Success Messages
    public static LOGOUT_SUCCESSFUL = "Log out successful";
    public static USER_VERIFICATION_SUCCESSFUL = "User verification successful";
    public static USER_BASIC_DETAILS_SENT = "User basic details sent";

    // Process Messages
    public static REQUESTING_USER_BASIC_DETAILS = "Requesting user basic details";

    // Incoming Calls Messages
    public static REQUESTING_STATS_FOR_DASHBOARD = "Requesting stats for dashboard";
    public static STATS_FOR_DASHBOARD_SENT = "Stats for dashboard sent";
    public static INCOMING_CALL_PAGED_LIST_REQUESTED = "Retrieving paged incoming calls";
    public static INCOMING_CALL_PAGED_LIST_SENT = "Paged incoming calls retrieved successfully";
    public static UPDATING_INCOMING_CALL = "Updating Incoming Call";
    public static INCOMING_CALL_UPDATED = "Incoming Call Updated";
    public static FETCHING_SINGLE_INCOMING_CALL = "Fetching Single Incoming Call";
    public static FETCHING_SINGLE_INCOMING_CALL_COMPLETED = "Fetching Single Incoming Call Completed";

    // Limo Booking
    public static ADDING_LIMO_BOOKING = "Adding Limo Booking";
    public static LIMO_BOOKING_ADDED = "Limo Booking Added";
    public static UPDATING_LIMO_BOOKING = "Updating Limo Booking";
    public static LIMO_BOOKING_UPDATED = "Limo Booking Updated";

    public static REQUESTING_AN_ESTIMATE = "Requesting an estimate";
    public static ESTIMATE_SENT = "Estimation sent";

    public static REQUESTING_AN_QUICK_ESTIMATE = "Requesting an estimate";
    public static QUICK_ESTIMATE_SENT = "Estimation sent";

    // Call
    public static REQUESTING_INBOUND_CALL_DATA = "Requesting inbound call data";
    public static INBOUND_CALL_DATA_SENT = "Inbound call data sent";
    public static UPDATING_CALL_DATA = "Updating call data";
    public static CALL_DATA_UPDATED = "Call data updated";

    public static PROCEEDING_FOR_BOOKING = "Proceeding for booking";
    public static PROCEEDED_FOR_BOOKING = "Proceeded for booking";

    public static PROCEEDING_FOR_CANCELLATION = "Proceeding for cancellation";
    public static PROCEEDED_FOR_CANCELLATION = "Proceeded for cancellation";

    public static REQUESTING_BOOKING_DETAILS = "Requesting booking details";
    public static BOOKING_DETAILS_SENT = "Booking details sent";

    //SMS
    public static INCOMING_SMS = "Incoming SMS";
    public static SMS_RESPONSE_SENT = "SMS Response sent";
    public static MESSAGES_PAGED_LIST_REQUESTED = "Retrieving paged messages";
    public static MESSAGES_PAGED_LIST_SENT = "Paged messages retrieved successfully";
    public static FETCHING_SINGLE_SMS_REQUEST = "Fetching Single SMS Request";
    public static FETCHING_SINGLE_SMS_REQUEST_COMPLETED = "Fetching Single SMS Request Completed";
    public static UPDATING_SMS_REQUEST = "Updating SMS Request";
    public static SMS_REQUEST_UPDATED = "SMS Request Updated";
    public static UPDATING_TEXT_CONTACT = "Updating text contact";
    public static TEXT_CONTACT_UPDATED = "Text contact updated";
    public static REQUESTING_SMS_REQUESTS_STATS_FOR_DASHBOARD = "Requesting sms request stats for dashboard";
    public static SMS_REQUESTS_STATS_STATS_FOR_DASHBOARD_SENT = "SMS request stats for dashboard sent";
    public static TRANSCRIPT_BY_TEXT_CONTACT_PAGED_LIST_REQUESTED = "Retrieving paged transcript by text contact";
    public static TRANSCRIPT_BY_TEXT_CONTACT_PAGED_LIST_SENT = "Paged transcript by text contact retrieved successfully";
    public static ADDING_FOLLOWUP_TEXT_MSG_BY_AGENT = "Adding followup text message by human";
    public static FOLLOWUP_TEXT_MSG_ADDED_BY_AGENT = "Followup text message added by human";
}

export class HttpCodes {
    public static OK = 200;
    public static CREATED = 201;
    public static ACCEPTED = 202;
    public static NO_CONTENT = 204;
    public static MOVED_PERMANENTLY = 301;
    public static FOUND = 302;
    public static NOT_MODIFIED = 304;
    public static BAD_REQUEST = 400;
    public static UNAUTHORIZED = 401;
    public static FORBIDDEN = 403;
    public static NOT_FOUND = 404;
    public static METHOD_NOT_ALLOWED = 405;
    public static CONFLICT = 409;
    public static UNPROCESSABLE_ENTITY = 422;
    public static INTERNAL_SERVER_ERROR = 500;
    public static NOT_IMPLEMENTED = 501;
    public static BAD_GATEWAY = 502;
    public static SERVICE_UNAVAILABLE = 503;
    public static GATEWAY_TIMEOUT = 504;
}
