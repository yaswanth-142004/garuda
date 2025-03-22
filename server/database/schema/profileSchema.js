import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
}, { _id: false });

const PersonalInfoSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true, index: true },
    phone: String,
    dateOfBirth: Date,
    address: AddressSchema,
    resume: String
}, { _id: false });

const AcademicSchema = new mongoose.Schema({
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    description: String,
    grade: String
}, { _id: false });

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    startDate: Date,
    endDate: Date,
    technologiesUsed: [String],
    projectLink: String,
    isOpenSource: Boolean
}, { _id: false });

const WorkExperienceSchema = new mongoose.Schema({
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String,
    isCurrent: Boolean
}, { _id: false });

const CertificationSchema = new mongoose.Schema({
    name: String,
    issuingOrganization: String,
    issueDate: Date,
    expirationDate: Date,
    credentialId: String,
    credentialURL: String
}, { _id: false });

const AchievementSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    issuer: String
}, { _id: false });

const PublicationSchema = new mongoose.Schema({
    title: String,
    publisher: String,
    publicationDate: Date,
    description: String,
    link: String
}, { _id: false });

const SocialSchema = new mongoose.Schema({
    linkedIn: String,
    github: String,
    twitter: String,
    website: String,
    medium: String,
    stackOverflow: String,
    leetcode: String
}, { _id: false });


const profileSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },  // Consider hashing before storing

        personalInfo: { type: PersonalInfoSchema, default: {} },
        academic: [AcademicSchema],
        projects: [ProjectSchema],
        skills: [String],
        workEx: [WorkExperienceSchema],
        certifications: [CertificationSchema],
        achievements: [AchievementSchema],
        publications: [PublicationSchema],
        socials: { type: SocialSchema, default: {} },
    },
    { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;