import { getFirstName, isValidPassword } from "../src/utils/user";

test("Should return first name when given full name", () => {
    const firstName = getFirstName("Landon Sturgeon");

    expect(firstName).toBe("Landon");
});

test("Should return first name when given first name", () => {
    const firstName = getFirstName("Landon");

    expect(firstName).toBe("Landon");
});

test("Should reject password shorter than 8 characters", () => {
    const isValid = isValidPassword("no");

    expect(isValid).toBe(false);
});

test("Should reject password containing 'password'", () => {
    const isValid = isValidPassword("password123");

    expect(isValid).toBe(false);
})