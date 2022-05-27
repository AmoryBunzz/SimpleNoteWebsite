const hashHelper = require(process.cwd() +
    '/helpers/password-encrypter/hash_helper')
const { transporter, mailConfig } = require(process.cwd() +
    '/helpers/mailer/transporter')
const uuid = require('uuid')

const { getUserByEmail, addNewUser } = require('../CRUD/user')
const { getRoleById } = require('../CRUD/role')
const { addNewUserInfo } = require('../CRUD/user_info')
const { addNewAuthKey } = require('../CRUD/authkey')

// Mail options
const VERIFY_EMAIL = 1

async function register(request, response) {
    try {
        // Check if email already registered
        const dbUser = await getUserByEmail(request.body.email)
        if (dbUser) {
            return response.status(409).json({
                message: 'Email already exists!',
            })
        }

        // Check if role is valid
        const dbRole = await getRoleById(request.body.role)
        if (!dbRole) {
            return response.status(409).json({
                message: 'Invalid role!',
            })
        }

        // Create new user
        const newUser = {
            name: request.body.name,
            email: request.body.email,
            password: hashHelper.hash(request.body.password),
            role: request.body.role,
        }

        // Add new user to database
        addNewUser(newUser).then((result) => {
            // Create new user info
            const newUserInfo = {
                user_id: result.id,
                avatar: 'public/images/avatars/user/default-avatar.png',
            }
            addNewUserInfo(newUserInfo)

            // Send email to verify user
            const authKey = uuid.v1()
            transporter.sendMail(
                mailConfig(result.email, VERIFY_EMAIL, authKey),
                function (err, info) {
                    if (err) console.log(err)
                    else
                        console.log(
                            'Email sended successfully! Info: ' + info.response,
                        )
                },
            )

            // Save authKey
            const newAuthKey = {
                user_id: result.id,
                key: authKey,
            }
            addNewAuthKey(newAuthKey)

            return response.status(201).json({
                message: 'Create user successfully!',
            })
        })
    } catch (error) {
        return response.status(500).json({
            message: 'Something went wrong!',
            error: error.message,
        })
    }
}

module.exports = register
