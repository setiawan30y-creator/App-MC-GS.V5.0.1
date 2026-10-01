/**

 * MC-App-Almara V5.0.1

 * PHASE 2A — Security Core

 *

 * Role + User + Password Hashing

 * Login/session akan dibangun pada tahap berikutnya.

 */



const SECURITY_STATUS = Object.freeze({

  ACTIVE: 'ACTIVE',

  INACTIVE: 'INACTIVE',

  LOCKED: 'LOCKED'

});



/**

 * =========================================================

 * PASSWORD

 * =========================================================

 */



function generateSalt_() {

  return Utilities.getUuid().replace(/-/g, '');

}



function hashPassword_(password, salt) {

  const value = String(password || '');



  if (!value) {

    throw new Error('Password tidak boleh kosong.');

  }



  if (value.length < 8) {

    throw new Error('Password minimal 8 karakter.');

  }



  const raw = Utilities.computeDigest(

    Utilities.DigestAlgorithm.SHA_256,

    salt + ':' + value,

    Utilities.Charset.UTF_8

  );



  return raw.map(function(byte) {

    const v = byte < 0 ? byte + 256 : byte;

    return ('0' + v.toString(16)).slice(-2);

  }).join('');

}



function createPasswordHash_(password) {

  const salt = generateSalt_();



  return {

    salt: salt,

    hash: hashPassword_(password, salt)

  };

}



/**

 * Format penyimpanan:

 *

 * salt$hash

 *

 * Contoh:

 * abc123$9f8a7...

 */

function buildPasswordHash_(password) {

  const result = createPasswordHash_(password);

  return result.salt + '$' + result.hash;

}



function verifyPassword_(password, storedValue) {

  const stored = String(storedValue || '');



  if (!stored.includes('$')) {

    return false;

  }



  const parts = stored.split('$');



  if (parts.length !== 2) {

    return false;

  }



  const salt = parts[0];

  const expectedHash = parts[1];



  const actualHash = hashPassword_(password, salt);



  return actualHash === expectedHash;

}



/**

 * =========================================================

 * ROLE

 * =========================================================

 */



function createRole(data) {

  const role = data || {};



  const roleId = normalizeText_(role.role_id) || uuid_('ROLE');

  const roleName = upper_(role.role_name);



  if (!roleName) {

    throw new Error('role_name wajib diisi.');

  }



  const permissions = Array.isArray(role.permissions)

    ? role.permissions

    : [];



  const now = now_();



  appendRecord_('03_roles', [

    roleId,

    roleName,

    JSON.stringify(permissions),

    role.status || SECURITY_STATUS.ACTIVE,

    now,

    now

  ]);



  return {

    success: true,

    role_id: roleId,

    role_name: roleName

  };

}



function listRoles() {

  return getTableObjects_('03_roles');

}



/**

 * =========================================================

 * USER

 * =========================================================

 */



function createUser(data) {

  const user = data || {};



  const username = normalizeText_(user.username).toLowerCase();

  const name = normalizeText_(user.name);

  const email = normalizeText_(user.email).toLowerCase();

  const roleId = normalizeText_(user.role_id);



  if (!username) {

    throw new Error('Username wajib diisi.');

  }



  if (!name) {

    throw new Error('Nama user wajib diisi.');

  }



  if (!roleId) {

    throw new Error('role_id wajib diisi.');

  }



  if (!user.password) {

    throw new Error('Password wajib diisi.');

  }



  const existing = listUsers().some(function(row) {

    return String(row.username || '').toLowerCase() === username;

  });



  if (existing) {

    throw new Error('Username sudah digunakan: ' + username);

  }



  const roleExists = listRoles().some(function(row) {

    return String(row.role_id) === roleId &&

           String(row.status) === SECURITY_STATUS.ACTIVE;

  });



  if (!roleExists) {

    throw new Error('Role tidak ditemukan atau tidak aktif: ' + roleId);

  }



  const passwordHash = buildPasswordHash_(user.password);

  const now = now_();

  const userId = uuid_('USR');



  appendRecord_('02_users', [

    userId,

    username,

    passwordHash,

    name,

    email,

    roleId,

    user.status || SECURITY_STATUS.ACTIVE,

    '',

    now,

    now

  ]);



  return {

    success: true,

    user_id: userId,

    username: username,

    role_id: roleId

  };

}



function listUsers() {

  return getTableObjects_('02_users').map(function(user) {

    return {

      user_id: user.user_id,

      username: user.username,

      name: user.name,

      email: user.email,

      role_id: user.role_id,

      status: user.status,

      last_login: user.last_login,

      created_at: user.created_at,

      updated_at: user.updated_at

    };

  });

}



function setUserStatus(userId, status) {

  const normalizedStatus = upper_(status);



  if (

    normalizedStatus !== SECURITY_STATUS.ACTIVE &&

    normalizedStatus !== SECURITY_STATUS.INACTIVE &&

    normalizedStatus !== SECURITY_STATUS.LOCKED

  ) {

    throw new Error('Status user tidak valid.');

  }



  const sh = getSheet_('02_users');

  const values = sh.getDataRange().getValues();



  const headers = values[0];

  const userIdIndex = headers.indexOf('user_id');

  const statusIndex = headers.indexOf('status');

  const updatedIndex = headers.indexOf('updated_at');



  if (userIdIndex === -1 || statusIndex === -1) {

    throw new Error('Schema 02_users tidak sesuai.');

  }



  for (let i = 1; i < values.length; i++) {

    if (String(values[i][userIdIndex]) === String(userId)) {

      sh.getRange(i + 1, statusIndex + 1).setValue(normalizedStatus);



      if (updatedIndex !== -1) {

        sh.getRange(i + 1, updatedIndex + 1).setValue(now_());

      }



      return {

        success: true,

        user_id: userId,

        status: normalizedStatus

      };

    }

  }



  throw new Error('User tidak ditemukan: ' + userId);

}



/**

 * =========================================================

 * SECURITY STATUS

 * =========================================================

 */



function securityReady() {

  return {

    authentication: false,

    session: false,

    permissions: true,

    roleManagement: true,

    userManagement: true,

    phase: '2A'

  };

}



function testCreateAdminRole() {

  return createRole({

    role_name: 'SUPER_ADMIN',

    permissions: [

      'dashboard.view',

      'transaction.view',

      'transaction.create',

      'transaction.cancel',

      'customer.view',

      'customer.create',

      'customer.edit',

      'kyc.view',

      'kyc.verify',

      'currency.view',

      'currency.manage',

      'stock.view',

      'stock.adjust',

      'cash.view',

      'cash.movement',

      'bank.view',

      'bank.movement',

      'closing.view',

      'closing.create',

      'closing.approve',

      'report.view',

      'compliance.view',

      'audit.view',

      'user.view',

      'user.manage',

      'settings.manage'

    ]

  });

}



function testCreateAdminUser() {

  const roles = listRoles();



  if (!roles.length) {

    throw new Error('Belum ada role.');

  }



  return createUser({

    username: 'superadmin',

    password: 'Almara@2026!',

    name: 'Super Administrator',

    email: 'admin@almara.local',

    role_id: roles[0].role_id

  });

}



/**

 * =========================================================

 * SESSION ENGINE

 * =========================================================

 */



const SESSION_CONFIG = Object.freeze({

  durationHours: 8,

  activeStatus: 'ACTIVE',

  expiredStatus: 'EXPIRED',

  revokedStatus: 'REVOKED'

});



function revokeActiveSessionsByUser_(userId) {

  const sheet = getSheet_('04_sessions');

  const values = sheet.getDataRange().getValues();



  if (values.length <= 1) return 0;



  const headers = values[0];

  const idxUser = headers.indexOf('user_id');

  const idxStatus = headers.indexOf('status');

  const idxLastSeen = headers.indexOf('last_seen');



  if (idxUser === -1 || idxStatus === -1) {

    throw new Error('Schema 04_sessions tidak sesuai.');

  }



  let revoked = 0;

  const now = new Date();



  for (let i = 1; i < values.length; i++) {

    const row = values[i];



    if (

      String(row[idxUser]) === String(userId) &&

      String(row[idxStatus]).toUpperCase() === SESSION_CONFIG.activeStatus

    ) {

      sheet.getRange(i + 1, idxStatus + 1)

        .setValue(SESSION_CONFIG.revokedStatus);



      if (idxLastSeen !== -1) {

        sheet.getRange(i + 1, idxLastSeen + 1)

          .setValue(now);

      }



      revoked++;

    }

  }



  return revoked;

}





function createSession_(user) {

  if (!user || !user.user_id) {

    throw new Error('User tidak valid.');

  }



  // Satu user hanya mempunyai satu session ACTIVE.

  revokeActiveSessionsByUser_(user.user_id);



  const sessionId = 'SES-' + Utilities.getUuid();



  const rawToken =

    Utilities.getUuid() +

    Utilities.getUuid();



  const tokenHash = hashToken_(rawToken);



  const createdAt = new Date();



  const expiresAt = new Date(

    createdAt.getTime() +

    SESSION_CONFIG.durationHours * 60 * 60 * 1000

  );



  const sheet = getSheet_('04_sessions');



  sheet.appendRow([

    sessionId,

    user.user_id,

    tokenHash,

    createdAt,

    expiresAt,

    createdAt,

    SESSION_CONFIG.activeStatus,

    '',

    ''

  ]);



  return {

    session_id: sessionId,

    token: rawToken,

    expires_at: expiresAt.toISOString()

  };

}



function hashToken_(token) {

  const raw = Utilities.computeDigest(

    Utilities.DigestAlgorithm.SHA_256,

    String(token || ''),

    Utilities.Charset.UTF_8

  );



  return raw.map(function(byte) {

    const value = byte < 0 ? byte + 256 : byte;

    return ('0' + value.toString(16)).slice(-2);

  }).join('');

}



function findUserByUsername_(username) {

  const normalized = normalizeText_(username).toLowerCase();



  return getTableObjects_('02_users').find(function(user) {

    return String(user.username || '').toLowerCase() === normalized;

  }) || null;

}



function findSessionByToken_(token) {

  const tokenHash = hashToken_(token);

  const rows = getTableObjects_('04_sessions');



  return rows.find(function(session) {

    return String(session.token_hash) === tokenHash;

  }) || null;

}



/**

 * =========================================================

 * LOGIN

 * =========================================================

 */



function login(username, password) {

  const user = findUserByUsername_(username);



  if (!user) {

    throw new Error('Username atau password salah.');

  }



  if (String(user.status) !== SECURITY_STATUS.ACTIVE) {

    throw new Error('User tidak aktif.');

  }



  if (!verifyPassword_(password, user.password_hash)) {

    throw new Error('Username atau password salah.');

  }



  const session = createSession_(user);



  updateLastLogin_(user.user_id);



  writeAudit_(

    'LOGIN',

    'USER',

    user.user_id,

    'Login berhasil'

  );



  return {

    success: true,

    session_id: session.session_id,

    token: session.token,

    expires_at: session.expires_at,

    user: {

      user_id: user.user_id,

      username: user.username,

      name: user.name,

      email: user.email,

      role_id: user.role_id

    }

  };

}



/**

 * =========================================================

 * LAST LOGIN

 * =========================================================

 */



function updateLastLogin_(userId) {

  const sh = getSheet_('02_users');

  const values = sh.getDataRange().getValues();



  if (!values.length) {

    throw new Error('Data user kosong.');

  }



  const headers = values[0];



  const userIdIndex = headers.indexOf('user_id');

  const lastLoginIndex = headers.indexOf('last_login');

  const updatedIndex = headers.indexOf('updated_at');



  if (userIdIndex === -1 || lastLoginIndex === -1) {

    throw new Error('Schema 02_users tidak sesuai.');

  }



  for (let i = 1; i < values.length; i++) {

    if (String(values[i][userIdIndex]) === String(userId)) {



      sh.getRange(i + 1, lastLoginIndex + 1)

        .setValue(now_());



      if (updatedIndex !== -1) {

        sh.getRange(i + 1, updatedIndex + 1)

          .setValue(now_());

      }



      return true;

    }

  }



  return false;

}



/**

 * =========================================================

 * SESSION VALIDATION

 * =========================================================

 */



function validateSession(token) {

  if (!token) {

    throw new Error('Session token tidak ditemukan.');

  }



  const session = findSessionByToken_(token);



  if (!session) {

    throw new Error('Session tidak valid.');

  }



  if (String(session.status) !== SESSION_CONFIG.activeStatus) {

    throw new Error('Session sudah tidak aktif.');

  }



  const expiresAt = new Date(session.expires_at);



  if (expiresAt.getTime() <= now_().getTime()) {

    markSessionExpired_(session.session_id);

    throw new Error('Session sudah expired.');

  }



  const user = getTableObjects_('02_users').find(function(row) {

    return String(row.user_id) === String(session.user_id);

  });



  if (!user) {

    throw new Error('User session tidak ditemukan.');

  }



  if (String(user.status) !== SECURITY_STATUS.ACTIVE) {

    throw new Error('User sudah tidak aktif.');

  }



  updateSessionLastSeen_(session.session_id);



  return {

    valid: true,

    session_id: session.session_id,

    user: {

      user_id: user.user_id,

      username: user.username,

      name: user.name,

      email: user.email,

      role_id: user.role_id

    }

  };

}



/**

 * =========================================================

 * LOGOUT

 * =========================================================

 */



function logout(token) {

  if (!token) {

    return {

      success: true

    };

  }



  const session = findSessionByToken_(token);



  if (!session) {

    return {

      success: true

    };

  }



  const sh = getSheet_('04_sessions');

  const values = sh.getDataRange().getValues();

  const headers = values[0];



  const sessionIdIndex = headers.indexOf('session_id');

  const statusIndex = headers.indexOf('status');



  for (let i = 1; i < values.length; i++) {

    if (String(values[i][sessionIdIndex]) === String(session.session_id)) {



      sh.getRange(i + 1, statusIndex + 1)

        .setValue(SESSION_CONFIG.revokedStatus);



      writeAudit_(

        'LOGOUT',

        'USER',

        session.user_id,

        'Logout berhasil'

      );



      return {

        success: true

      };

    }

  }



  return {

    success: true

  };

}



/**

 * =========================================================

 * SESSION HELPERS

 * =========================================================

 */



function updateSessionLastSeen_(sessionId) {

  const sh = getSheet_('04_sessions');

  const values = sh.getDataRange().getValues();

  const headers = values[0];



  const sessionIdIndex = headers.indexOf('session_id');

  const lastSeenIndex = headers.indexOf('last_seen');



  for (let i = 1; i < values.length; i++) {

    if (String(values[i][sessionIdIndex]) === String(sessionId)) {



      sh.getRange(i + 1, lastSeenIndex + 1)

        .setValue(now_());



      return true;

    }

  }



  return false;

}



function markSessionExpired_(sessionId) {

  const sh = getSheet_('04_sessions');

  const values = sh.getDataRange().getValues();

  const headers = values[0];



  const sessionIdIndex = headers.indexOf('session_id');

  const statusIndex = headers.indexOf('status');



  for (let i = 1; i < values.length; i++) {

    if (String(values[i][sessionIdIndex]) === String(sessionId)) {



      sh.getRange(i + 1, statusIndex + 1)

        .setValue(SESSION_CONFIG.expiredStatus);



      return true;

    }

  }



  return false;

}



/**

 * =========================================================

 * SERVER-SIDE AUTH GUARD

 * =========================================================

 */



function requireAuthenticated_(token) {

  return validateSession(token);

}



function testLogin() {

  const result = login(

    'superadmin',

    'Almara@2026!'

  );



  Logger.log(JSON.stringify(result, null, 2));



  return result;

}



function testValidateSession() {

  const loginResult = login(

    'superadmin',

    'Almara@2026!'

  );



  const result = validateSession(loginResult.token);



  Logger.log(JSON.stringify(result, null, 2));



  return result;

}



function testSingleActiveSession() {

  const first = login(

    'superadmin',

    'Almara@2026!'

  );



  const second = login(

    'superadmin',

    'Almara@2026!'

  );



  const sessions = getSheet_('04_sessions')

    .getDataRange()

    .getValues();



  const headers = sessions[0];



  const userIdx = headers.indexOf('user_id');

  const statusIdx = headers.indexOf('status');



  const activeSessions = sessions

    .slice(1)

    .filter(function(row) {

      return (

        String(row[userIdx]) === 'USR-5edb47d6-1ddf-438d-b5bd-82dd61ab7a84' &&

        String(row[statusIdx]).toUpperCase() === 'ACTIVE'

      );

    });



  const result = {

    first_session: first.session_id,

    second_session: second.session_id,

    active_session_count: activeSessions.length,

    pass: activeSessions.length === 1

  };



  Logger.log(JSON.stringify(result, null, 2));



  return result;

}