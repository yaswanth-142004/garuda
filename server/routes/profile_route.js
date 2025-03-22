import express from "express";
import Profile from "../database/schema/profileSchema.js";

const router = express.Router();

router.post("/:userId/profile", async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName, lastName, email, phone, dateOfBirth, address, resume } = req.body;

        // Required field validation
        if (!firstName || !lastName || !email || !phone) {
            return res.status(400).json({ error: "First name, last name, email, and phone are required." });
        }

        // Validate email format
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email format." });
        }

        // Validate date of birth (must be a past date)
        if (dateOfBirth && new Date(dateOfBirth) >= new Date()) {
            return res.status(400).json({ error: "Invalid date of birth. It must be in the past." });
        }

        // Check if email is already taken (by another user)
        const existingUser = await Profile.findOne({ "personalInfo.email": email, _id: { $ne: userId } });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already in use by another account." });
        }

        // Handle address field: Convert string to object if necessary
        let formattedAddress = address;
        if (typeof address === "string") {
            const [street, city, state, zip] = address.split(", ").map((s) => s.trim());
            formattedAddress = { street, city, state, zip };
        }

        // Prepare update fields dynamically
        const updateFields = {};
        const fields = ["firstName", "lastName", "email", "phone", "dateOfBirth", "resume"];
        
        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updateFields[`personalInfo.${field}`] = req.body[field];
            }
        });

        // Handle address separately
        if (address !== undefined) {
            updateFields["personalInfo.address"] = formattedAddress;
        }

        // Find user and update profile
        const updatedProfile = await Profile.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Profile updated successfully.", profile: updatedProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/:userId/academics", async (req, res) => {
    try {
        const { userId } = req.params;
        const { academics } = req.body; // Expecting an array of academic details

        // Validate input
        if (!Array.isArray(academics) || academics.length === 0) {
            return res.status(400).json({ error: "Academics data must be a non-empty array." });
        }

        // Validate each entry
        for (const academic of academics) {
            const { institution, degree, fieldOfStudy, startDate, endDate, description, grade } = academic;

            if (!institution || !degree || !fieldOfStudy || !startDate) {
                return res.status(400).json({
                    error: "Institution, degree, field of study, and start date are required for each entry.",
                });
            }

            if (endDate && new Date(startDate) >= new Date(endDate)) {
                return res.status(400).json({ error: `End date must be after start date for ${institution}.` });
            }

            if (grade && !/^[A-Fa-f0-9.]+$/.test(grade)) {
                return res.status(400).json({ error: `Invalid grade format for ${institution}.` });
            }
        }

        // Push academic details into profile
        const updatedProfile = await Profile.findByIdAndUpdate(
            userId,
            { $addToSet: { academic: { $each: academics } } }, // Append multiple entries
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Academic records added successfully.", profile: updatedProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/:userId/projects", async (req, res) => {
    try {
        const { userId } = req.params;
        const { projects } = req.body; // Expecting an array of project details

        // Validate input
        if (!Array.isArray(projects) || projects.length === 0) {
            return res.status(400).json({ error: "Projects data must be a non-empty array." });
        }

        // Validate each project entry
        for (const project of projects) {
            const { title, description, startDate, endDate, technologiesUsed, projectLink, isOpenSource } = project;

            if (!title || !description) {
                return res.status(400).json({
                    error: "Title, description are required for each project.",
                });
            }

            if (endDate && new Date(startDate) >= new Date(endDate)) {
                return res.status(400).json({ error: `End date must be after start date for ${title}.` });
            }

            if (projectLink && !/^https?:\/\/\S+$/.test(projectLink)) {
                return res.status(400).json({ error: `Invalid project link format for ${title}.` });
            }

            if (technologiesUsed && !Array.isArray(technologiesUsed)) {
                return res.status(400).json({ error: `Technologies used must be an array for ${title}.` });
            }
        }

        // Push project details into profile
        const updatedProfile = await Profile.findByIdAndUpdate(
            userId,
            { $addToSet: { projects: { $each: projects } } }, // Append multiple projects
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Projects added successfully.", profile: updatedProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/:userId/skills", async (req, res) => {
    try {
        const { userId } = req.params;
        const { skills } = req.body;

        // Validate input
        if (!Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ error: "Skills must be a non-empty array of strings." });
        }

        if (!skills.every(skill => typeof skill === "string" && skill.trim().length > 0)) {
            return res.status(400).json({ error: "Each skill must be a non-empty string." });
        }

        // Update skills in the profile
        const updatedProfile = await Profile.findByIdAndUpdate(
            userId,
            { $set: { skills } }, // Overwrites existing skills
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Skills updated successfully.", profile: updatedProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/:userId/work-experience", async (req, res) => {
    try {
        const { userId } = req.params;
        const { workExperience } = req.body;

        // Validate input
        if (!Array.isArray(workExperience) || workExperience.length === 0) {
            return res.status(400).json({ error: "Work experience must be a non-empty array of objects." });
        }

        // Validate each work experience entry
        for (const experience of workExperience) {
            const { company, position, startDate, endDate, description, isCurrent } = experience;

            if (!company || !position) {
                return res.status(400).json({ error: "Company, position are required for each work experience." });
            }

            if (new Date(startDate) >= new Date(endDate) && !isCurrent) {
                return res.status(400).json({ error: "End date must be greater than start date, unless currently employed." });
            }

            if (typeof isCurrent !== "boolean") {
                return res.status(400).json({ error: "isCurrent must be a boolean value." });
            }
        }

        // Update work experience in the profile
        const updatedProfile = await Profile.findByIdAndUpdate(
            userId,
            { $addToSet: { workEx: { $each: workExperience } } }, // Adds new entries instead of replacing
            { new: true, runValidators: true }
        );
        

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Work experience updated successfully.", profile: updatedProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/:userId/certifications", async (req, res) => {
    try {
        const { userId } = req.params;
        const { certifications } = req.body; // Expecting an array of certifications

        if (!Array.isArray(certifications) || certifications.length === 0) {
            return res.status(400).json({ error: "Certifications must be a non-empty array." });
        }

        // Validate each certification entry
        for (const cert of certifications) {
            if (!cert.name || !cert.issuingOrganization || !cert.issueDate) {
                return res.status(400).json({ error: "Name, issuing organization, and issue date are required." });
            }
            if (cert.expirationDate && new Date(cert.expirationDate) <= new Date(cert.issueDate)) {
                return res.status(400).json({ error: "Expiration date must be after issue date." });
            }
        }

        // Update user's certifications
        const updatedProfile = await Profile.findByIdAndUpdate(
            userId,
            { $addToSet: { certifications } }, // Replaces all certifications
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Certifications updated successfully.", profile: updatedProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/:userId/achievements", async (req, res) => {
    try {
        const { userId } = req.params;
        const { achievements } = req.body; // Expecting an array of achievements

        if (!Array.isArray(achievements) || achievements.length === 0) {
            return res.status(400).json({ error: "Achievements must be a non-empty array." });
        }

        // Validate each achievement entry
        for (const achievement of achievements) {
            if (!achievement.title || !achievement.date) {
                return res.status(400).json({ error: "Title and date are required for each achievement." });
            }
            if (new Date(achievement.date) > new Date()) {
                return res.status(400).json({ error: "Achievement date cannot be in the future." });
            }
        }

        // Update user's achievements
        const updatedProfile = await Profile.findByIdAndUpdate(
            userId,
            { $addToSet: { achievements } }, // Overwrites all achievements
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Achievements updated successfully.", profile: updatedProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/:userId/publications", async (req, res) => {
    try {
        const { userId } = req.params;
        const { publications } = req.body; // Expecting an array of publications

        if (!Array.isArray(publications) || publications.length === 0) {
            return res.status(400).json({ error: "Publications must be a non-empty array." });
        }

        // Validate each publication entry
        for (const publication of publications) {
            if (!publication.title || !publication.publicationDate || !publication.publisher) {
                return res.status(400).json({ error: "Title, publisher, and publication date are required for each publication." });
            }
            if (new Date(publication.publicationDate) > new Date()) {
                return res.status(400).json({ error: "Publication date cannot be in the future." });
            }
        }

        // Update user's publications
        const updatedProfile = await Profile.findByIdAndUpdate(
            userId,
            { $addToSet: { publications } }, // Overwrites all publications
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Publications updated successfully.", profile: updatedProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.post("/:userId/socials", async (req, res) => {
    try {
        const { userId } = req.params;
        const { socials } = req.body; // Expecting an object with social links

        if (!socials || typeof socials !== "object" || Object.keys(socials).length === 0) {
            return res.status(400).json({ error: "At least one social link is required." });
        }

        const urlRegex = /^(https?:\/\/)?([\w\d-]+\.)+[\w]{2,}(\/[\w\d-./?%&=]*)?$/;

        // Validate URLs if provided
        for (const [platform, url] of Object.entries(socials)) {
            if (url && !urlRegex.test(url)) {
                return res.status(400).json({ error: `Invalid URL format for ${platform}.` });
            }
        }

        // Update user's social links
        const updatedProfile = await Profile.findByIdAndUpdate(
            userId,
            { $set: { socials } }, // Overwrites existing socials
            { new: true, runValidators: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Social links updated successfully.", profile: updatedProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
});

router.get("/:userId/profile", async (req, res) => {
    try {
        const { userId } = req.params;

        const profile = await Profile.findById(userId).select("-password -username"); // Exclude password field

        if (!profile) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json(profile);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default router;