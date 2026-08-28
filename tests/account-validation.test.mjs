import assert from "node:assert/strict";
import test from "node:test";
import { validateContact, validateEmail, validatePassword } from "../src/lib/account-validation.ts";

test("el teléfono es opcional y el nombre conserva tildes", () => {
  assert.deepEqual(validateContact("  Julia   María  ", "", "  San José "), {
    fullName: "Julia María",
    contactPhone: "",
    community: "San José",
  });
});
test("acepta un teléfono internacional de contacto", () => {
  assert.equal(
    validateContact("Julia María", "+57 300 123 4567", "").contactPhone,
    "+57 300 123 4567",
  );
});
test("rechaza datos no válidos sin completar ni inventar dígitos", () => {
  assert.throws(() => validateContact("Julia María", "E014129277", ""));
  assert.throws(() => validateContact("Julia María", "123", ""));
  assert.throws(() => validateContact(" ", "", ""));
  assert.throws(() => validateContact("Julia María", "", "a".repeat(161)));
});
test("normaliza espacios exteriores y mayúsculas del correo", () => {
  assert.equal(validateEmail(" JULIA@example.com ", "anterior@example.com"), "julia@example.com");
});
test("no acepta correo incompleto, espacios interiores ni el correo actual", () => {
  for (const email of [
    "julia@gmail",
    "julia @gmail.com",
    "@gmail.com",
    "julia@@gmail.com",
    "ACTUAL@example.com",
  ]) {
    assert.throws(() => validateEmail(email, "actual@example.com"));
  }
});
test("la contraseña debe coincidir y no puede ser la temporal", () => {
  assert.throws(() => validatePassword("acceso123", "acceso123"));
  assert.throws(() => validatePassword("nuevaClave9!", "distintaClave9!"));
  assert.throws(() => validatePassword("corta", "corta"));
  assert.equal(validatePassword("NuevaClave9!", "NuevaClave9!"), "NuevaClave9!");
});
test("respeta el límite de bcrypt en bytes, también con Unicode", () => {
  assert.equal(validatePassword("a".repeat(72), "a".repeat(72)).length, 72);
  assert.throws(() => validatePassword("a".repeat(73), "a".repeat(73)));
  assert.throws(() => validatePassword("😀".repeat(19), "😀".repeat(19)));
});
