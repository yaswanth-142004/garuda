import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const suggestedSkills = [
    "JavaScript", "React", "Node.js", "Python", "Django", "Flask",
    "FastAPI", "TypeScript", "MongoDB", "PostgreSQL", "Docker",
    "Kubernetes", "GraphQL", "Next.js", "Express.js", "Firebase",
    "TensorFlow", "PyTorch", "Solidity", "Ethereum"
];

function SkillInfo({ formRef, onSuccess }) {
    const [skills, setSkills] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({
        defaultValues: { skills: [] },
    });

    const onSubmit = (data) => {
        console.log(data);
        setSkills(data.skills);
        setIsSubmitted(true);
        onSuccess();
    };

    // Add skill on Enter key press
    const handleAddSkill = (event) => {
        if (event.key === "Enter" && event.target.value.trim() !== "") {
            event.preventDefault();
            const newSkill = event.target.value.trim();
            if (!skills.includes(newSkill)) {
                const updatedSkills = [...skills, newSkill];
                setSkills(updatedSkills);
                form.setValue("skills", updatedSkills);
            }
            event.target.value = "";
        }
    };

    // Remove skill when clicked
    const handleRemoveSkill = (skill) => {
        const updatedSkills = skills.filter((s) => s !== skill);
        setSkills(updatedSkills);
        form.setValue("skills", updatedSkills);
    };

    // Add suggested skill when clicked
    const handleSuggestedSkillClick = (skill) => {
        if (!skills.includes(skill)) {
            const updatedSkills = [...skills, skill];
            setSkills(updatedSkills);
            form.setValue("skills", updatedSkills);
        }
    };

    return (
        <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
            {isSubmitted ? (
                <div className="space-y-4 text-lg">
                    <h2 className="text-xl font-semibold">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                            <Badge key={index} className="px-3 py-1">{skill}</Badge>
                        ))}
                    </div>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>Edit</Button>
                </div>
            ) : (
                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* Skill Input Field */}
                        <FormField
                            control={form.control}
                            name="skills"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Enter Skills</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Type a skill and press Enter"
                                            onKeyDown={handleAddSkill}
                                        />
                                    </FormControl>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {skills.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                className="cursor-pointer px-3 py-1"
                                                onClick={() => handleRemoveSkill(skill)}
                                            >
                                                {skill} ✕
                                            </Badge>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Suggested Skills */}
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Common Skills</h3>
                            <div className="flex flex-wrap items-center justify-center gap-2">
                                {suggestedSkills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        className="cursor-pointer bg-gray-200 text-black px-3 py-1"
                                        onClick={() => handleSuggestedSkillClick(skill)}
                                    >
                                        + {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            )}
        </Card>
    );
}

export default SkillInfo;
