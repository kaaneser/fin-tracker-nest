export class CreateCategoryDto {
    name: string;
    type: "income" | "expense";
    color: string;
}
