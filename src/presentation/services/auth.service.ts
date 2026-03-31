import { bcryptAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, RegisterUserDto, UserEntity } from "../../domain";
import { LoginUserDto } from "../../domain/dtos/auth/login-user.dto";

export class AuthService {

    // DI
    constructor(

    ) { }

    public async registerUser(registerUserDto: RegisterUserDto) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });

        if (existUser) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel(registerUserDto);

            // Encryptar la contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();

            //TODO: JWT <- para mantener la autenticación de usuario

            //TODO: Email de comfirmación

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return {
                user: userEntity,
                token: 'ABC'
            };

        }
        catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }


    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({ email: loginUserDto.email });

        if (!user) throw CustomError.badRequest('Email do not exist');

        try {

            // Encryptar la contraseña
            const isMatching = bcryptAdapter.compare(
                loginUserDto.password,
                user.password
            );

            if (!isMatching) throw CustomError.badRequest('Password is not valid');

            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
            if (!token) throw CustomError.internalServer('Error while creating JWT');

            if (token)

                return {
                    user: userEntity,
                    token
                };

        }
        catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

    }
}