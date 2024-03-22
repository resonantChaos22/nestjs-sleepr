# March 22 Notes

## User Roles

- We added roles optional property in all the dtos and schemas.
- `@IsString({each: true})` -> here `each: true` makes sure that each element of the array follows this rule.
- `SetMetadata('roles', roles)` is used to set "roles" as roles in context and this data can be retrieved by using Reflector.
