import { Validators } from "../../../config";

export class CreateProductDto {

    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: string,
        public readonly description: string,
        public readonly user: string, // ID user
        public readonly category: string, // ID category

    ) { }


    static create(props: { [key: string]: any }): [string?, CreateProductDto?] {

        const {
            name,
            available,
            prices,
            description,
            user,
            category
        } = props;

        if (!name) return ['Missing name'];

        if (!user) return ['Missing user'];
        if (!Validators.isValidId(user)) return ['Invalid user id'];

        if (!category) return ['Missing category'];
        if (!Validators.isValidId(category)) return ['Invalid category id'];

        return [undefined, new CreateProductDto(
            name,
            !!available,
            prices,
            description,
            user,
            category
        )]

    }
}