import * as yup from "yup";

export interface UpdateUsernameForm {
  username: string;
}

export interface UpdateEmailForm {
  email: string;
}

export interface UpdatePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface SwitchUserTypeForm {
  usertype: "user" | "professional";
}

//yup schemas
export const updateUsernameSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required("Username is required")
    .max(30, "Username cannot exceed 30 characters"),
});

export const updateEmailSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
});

export const updatePasswordSchema = yup.object({
  oldPassword: yup.string().required("Old password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password cannot exceed 30 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number, and special character"
    )
    .required("New password is required"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm new password is required"),
});

export const switchUserTypeSchema = yup.object({
  usertype: yup
    .string()
    .oneOf(["user", "professional"] as const)
    .required("User type is required"),
});
