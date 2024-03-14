# March 14 Notes

## Payments

- payments code is pretty self-explanatory. Just read the stripe documentation.
- nested validation

```TS
  @IsDefined()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CardDto)
  card: CardDto;
```

- This validates all the Dtos inside the CardDto as well. `@Type(() => CardDto)` is required to parse the request object as a class for the sake of validation.
