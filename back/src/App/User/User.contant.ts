export const JWT_EXPIRATION_TIME = 8*3600;//second

export const USER_PRIVILEGES = {
    'store frame' : 0,
    'edit frame' : 5,
    'delete frame' : 10,
    'show frame' : 15,
    'publish frame' : 21,
    'refuse frame' : 22,

    'store sentence' : 50,
    'edit sentence' : 55,
    'delete sentence' : 60,
    'show sentence' : 65,

    'store tagged sentence' : 100,
    'edit tagged sentence' : 105,
    'delete tagged sentence' : 110,
    'show tagged sentence' : 115,
    'publish tagged sentence' : 121,
    'refuse tagged sentence' : 122,

    'store user' : 150,
    'edit user' : 155,
    'delete user' : 160,
    'show user' : 165,

    'store element' : 180,
    'edit element' : 185,
    'delete element' : 190,

    'store lexicalUnit' : 200,
    'edit lexicalUnit' : 205,
    'delete lexicalUnit' : 210,
};