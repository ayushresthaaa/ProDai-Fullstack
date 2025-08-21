import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  updateUsernameAPI,
  updateEmailAPI,
  updatePasswordAPI,
  switchToProfessionalAPI,
  switchToUserAPI,
} from "../../shared/config/api";
import styles from "./changeCred.module.css";
import {
  type UpdateUsernameForm,
  type UpdateEmailForm,
  type UpdatePasswordForm,
  type SwitchUserTypeForm,
  updateUsernameSchema,
  updateEmailSchema,
  updatePasswordSchema,
  switchUserTypeSchema,
} from "./changeCred.schema"; // adjust path if needed
import { Navbar } from "../../components/ui/navbar/Navbar";

// Helper button to prevent hover/glow/move
const FixedButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...props
}) => (
  <button
    {...props}
    style={{
      boxShadow: "none",
      outline: "none",
      transform: "none",
    }}
  >
    {children}
  </button>
);

export const ChangeCred = () => {
  const [sucess, setSuccessMessage] = useState("");
  const [error, setErrorMessage] = useState("");

  const {
    register: registerUsername,
    handleSubmit: handleSubmitUsername,
    formState: { errors: usernameErrors },
  } = useForm<UpdateUsernameForm>({
    resolver: yupResolver(updateUsernameSchema),
  });

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
  } = useForm<UpdateEmailForm>({ resolver: yupResolver(updateEmailSchema) });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
  } = useForm<UpdatePasswordForm>({
    resolver: yupResolver(updatePasswordSchema),
  });

  const {
    register: registerUsertype,
    handleSubmit: handleSubmitUsertype,
    formState: { errors: usertypeErrors },
  } = useForm<SwitchUserTypeForm>({
    resolver: yupResolver(switchUserTypeSchema),
  });

  // Handlers
  const onUpdateUsername = async (data: UpdateUsernameForm) => {
    try {
      const res = await updateUsernameAPI(data.username);
      setSuccessMessage(res.message);
    } catch (err: unknown) {
      const error = err as { message: string };
      setErrorMessage(error.message || "Failed to update username");
    }
  };

  const onUpdateEmail = async (data: UpdateEmailForm) => {
    try {
      const res = await updateEmailAPI(data.email);
      setSuccessMessage(res.message);
      setErrorMessage("");
    } catch (err: unknown) {
      const error = err as { message: string };
      setErrorMessage(error.message || "Failed to update email");
      setSuccessMessage("");
    }
  };

  const onUpdatePassword = async (data: UpdatePasswordForm) => {
    try {
      const res = await updatePasswordAPI(data.oldPassword, data.newPassword);
      setSuccessMessage(res.message);
      setErrorMessage("");
    } catch (err: unknown) {
      const error = err as { message: string };
      setErrorMessage(error.message || "Failed to update password");
      setSuccessMessage("");
    }
  };

  const onSwitchUsertype = async (data: SwitchUserTypeForm) => {
    try {
      if (data.usertype === "professional") {
        const res = await switchToProfessionalAPI();
        setSuccessMessage(res.message);
      } else {
        const res = await switchToUserAPI();
        setSuccessMessage(res.message);
      }
      setErrorMessage("");
    } catch (err: unknown) {
      const error = err as { message: string };
      setErrorMessage(error.message || "Failed to switch account type");
      setSuccessMessage("");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Manage Your Account</h1>

        {/* Username Form */}
        <form
          onSubmit={handleSubmitUsername(onUpdateUsername)}
          className={styles.section}
        >
          <h2>Change Username</h2>
          <div className={styles.inputGroup}>
            <input
              {...registerUsername("username")}
              type="text"
              placeholder=" "
              className={styles.formInput}
            />
            <label className={styles.formLabel}>Username</label>
            {usernameErrors.username && (
              <p className={styles.errorMessage}>
                {usernameErrors.username.message}
              </p>
            )}
          </div>
          <FixedButton type="submit" className={styles.button}>
            Update Username
          </FixedButton>
        </form>

        {/* Email Form */}
        <form
          onSubmit={handleSubmitEmail(onUpdateEmail)}
          className={styles.section}
        >
          <h2>Change Email</h2>
          <div className={styles.inputGroup}>
            <input
              {...registerEmail("email")}
              type="email"
              placeholder=" "
              className={styles.formInput}
            />
            <label className={styles.formLabel}>Email</label>
            {emailErrors.email && (
              <p className={styles.errorMessage}>{emailErrors.email.message}</p>
            )}
          </div>
          <FixedButton type="submit" className={styles.button}>
            Update Email
          </FixedButton>
        </form>

        {/* Password Form */}
        <form
          onSubmit={handleSubmitPassword(onUpdatePassword)}
          className={styles.section}
        >
          <h2>Change Password</h2>
          <div className={styles.inputGroup}>
            <input
              {...registerPassword("oldPassword")}
              type="password"
              placeholder=" "
              className={styles.formInput}
            />
            <label className={styles.formLabel}>Old Password</label>
            {passwordErrors.oldPassword && (
              <p className={styles.errorMessage}>
                {passwordErrors.oldPassword.message}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              {...registerPassword("newPassword")}
              type="password"
              placeholder=" "
              className={styles.formInput}
            />
            <label className={styles.formLabel}>New Password</label>
            {passwordErrors.newPassword && (
              <p className={styles.errorMessage}>
                {passwordErrors.newPassword.message}
              </p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <input
              {...registerPassword("confirmNewPassword")}
              type="password"
              placeholder=" "
              className={styles.formInput}
            />
            <label className={styles.formLabel}>Confirm New Password</label>
            {passwordErrors.confirmNewPassword && (
              <p className={styles.errorMessage}>
                {passwordErrors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <FixedButton type="submit" className={styles.button}>
            Update Password
          </FixedButton>
        </form>

        {/* Switch User Type */}
        <form
          onSubmit={handleSubmitUsertype(onSwitchUsertype)}
          className={styles.section}
        >
          <h2>Switch Account Type</h2>
          <select {...registerUsertype("usertype")} className={styles.select}>
            <option value="user">User</option>
            <option value="professional">Professional</option>
          </select>
          {usertypeErrors.usertype && (
            <p className={styles.errorMessage}>
              {usertypeErrors.usertype.message}
            </p>
          )}
          <FixedButton type="submit" className={styles.button}>
            Switch
          </FixedButton>
        </form>

        {/* Modal */}
        {(sucess || error) && (
          <div className="modal-backdrop">
            <div className="modal">
              <p>{sucess || error}</p>
              <FixedButton
                onClick={() => {
                  setSuccessMessage("");
                  setErrorMessage("");
                }}
              >
                Close
              </FixedButton>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
