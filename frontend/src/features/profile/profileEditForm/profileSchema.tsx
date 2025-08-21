import * as yup from "yup";

export const profileSchema = yup
  .object({
    avatar: yup
      .string()
      .url("Must be a valid URL")
      .nullable()
      .default(undefined),
    name: yup.string().required("Name is required"),
    location: yup.string().nullable().default(undefined),
    bio: yup.string().nullable().default(undefined),

    // Arrays are now required with default empty arrays
    skills: yup
      .array()
      .of(yup.string().required("Skill cannot be empty"))
      .min(1, "At least one skill is required")
      .required()
      .default([]),

    availability: yup
      .array()
      .of(yup.boolean())
      .length(7)
      .required()
      .default(Array(7).fill(false)),

    contact: yup
      .object({
        email: yup.string().email().nullable().default(undefined),
        github: yup.string().nullable().default(undefined),
        linkedin: yup.string().nullable().default(undefined),
      })
      .required()
      .default({}),

    experience: yup
      .array()
      .of(
        yup.object({
          title: yup.string().required("Title is required"),
          company: yup.string().required("Company is required"),
          startYear: yup.number().required("Start year is required"),
          endYear: yup.number().nullable().default(undefined),
          description: yup.string().nullable().default(undefined),
        })
      )
      .min(1, "At least one experience is required")
      .required()
      .default([]),

    qualifications: yup
      .array()
      .of(
        yup.object({
          title: yup.string().required("Title is required"),
          institution: yup.string().required("Institution is required"),
          year: yup.number().required("Year is required"),
        })
      )
      .min(1, "At least one qualification is required")
      .required()
      .default([]),
  })
  .required();
