import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

function ProjectsInfo({ formRef, onSuccess }) {
    const [projects, setProjects] = useState([
        {
            title: "",
            description: "",
            startDate: "",
            endDate: "",
            technologiesUsed: [],
            projectLink: "",
            isOpenSource: false,
        },
    ]);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({
        defaultValues: { projects },
    });

    const onSubmit = (data) => {
        console.log(data);
        setProjects(data.projects);
        setIsSubmitted(true);
        onSuccess();
    };

    const addProject = () => {
        setProjects([...projects, {
            title: "", description: "", startDate: "", endDate: "",
            technologiesUsed: [], projectLink: "", isOpenSource: false
        }]);
    };

    const removeProject = (index) => {
        const updatedProjects = projects.filter((_, i) => i !== index);
        setProjects(updatedProjects);
        form.setValue("projects", updatedProjects);
    };

    const handleAddTech = (index, event) => {
        if (event.key === "Enter" && event.target.value.trim() !== "") {
            event.preventDefault();
            const newTech = event.target.value.trim();
            const updatedProjects = [...projects];
            updatedProjects[index].technologiesUsed = [...updatedProjects[index].technologiesUsed, newTech];
            setProjects(updatedProjects);
            form.setValue(`projects.${index}.technologiesUsed`, updatedProjects[index].technologiesUsed);
            event.target.value = "";
        }
    };

    const handleRemoveTech = (index, tech) => {
        const updatedProjects = [...projects];
        updatedProjects[index].technologiesUsed = updatedProjects[index].technologiesUsed.filter(t => t !== tech);
        setProjects(updatedProjects);
        form.setValue(`projects.${index}.technologiesUsed`, updatedProjects[index].technologiesUsed);
    };

    return (
        <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
            {isSubmitted ? (
                <div className="space-y-4 text-lg">
                    <h2 className="text-xl font-semibold">Projects</h2>
                    {projects.map((project, index) => (
                        <div key={index} className="border p-3 rounded-lg">
                            <p><strong>Title:</strong> {project.title}</p>
                            <p><strong>Description:</strong> {project.description}</p>
                            <p><strong>Start Date:</strong> {project.startDate}</p>
                            <p><strong>End Date:</strong> {project.endDate}</p>
                            <p><strong>Technologies Used:</strong> {project.technologiesUsed.join(", ")}</p>
                            <p><strong>Project Link:</strong> <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{project.projectLink}</a></p>
                            <p><strong>Open Source:</strong> {project.isOpenSource ? "Yes" : "No"}</p>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>Edit</Button>
                </div>
            ) : (
                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {projects.map((project, index) => (
                            <div key={index} className="border p-4 rounded-lg space-y-3 relative">
                                {/* Delete Button (❌) */}
                                <button 
                                    type="button" 
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                    onClick={() => removeProject(index)}
                                >
                                    <X size={20} />
                                </button>

                                <h3 className="text-lg font-semibold">Project {index + 1}</h3>

                                {["title", "description", "startDate", "endDate", "projectLink"].map((fieldName) => (
                                    <FormField
                                        key={fieldName}
                                        control={form.control}
                                        name={`projects.${index}.${fieldName}`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {fieldName.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                                                </FormLabel>
                                                <FormControl>
                                                    {fieldName === "description" ? (
                                                        <Textarea {...field} required />
                                                    ) : (
                                                        <Input {...field} type={fieldName.includes("Date") ? "date" : "text"} required />
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}

                                {/* Technologies Used - Multi Input */}
                                <FormItem>
                                    <FormLabel>Technologies Used</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            placeholder="Type a technology and press Enter"
                                            onKeyDown={(e) => handleAddTech(index, e)}
                                        />
                                    </FormControl>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {projects[index].technologiesUsed.map((tech, i) => (
                                            <Badge
                                                key={i}
                                                className="cursor-pointer"
                                                onClick={() => handleRemoveTech(index, tech)}
                                            >
                                                {tech} ✕
                                            </Badge>
                                        ))}
                                    </div>
                                </FormItem>

                                {/* Open Source Checkbox */}
                                <FormField
                                    control={form.control}
                                    name={`projects.${index}.isOpenSource`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => form.setValue(`projects.${index}.isOpenSource`, checked)}
                                                />
                                            </FormControl>
                                            <FormLabel>Is Open Source?</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}

                        <Button type="button" variant="outline" onClick={addProject}>Add Another Project</Button>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            )}
        </Card>
    );
}

export default ProjectsInfo;
