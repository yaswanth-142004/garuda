import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react"; // Import the close icon

function WorkInfo({ formRef, onSuccess }) {
    const [workExperiences, setWorkExperiences] = useState([
        {
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
            isCurrent: false,
        },
    ]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({
        defaultValues: { workExperiences },
    });

    const onSubmit = (data) => {
        setWorkExperiences(data.workExperiences);
        setIsSubmitted(true);
        onSuccess();
    };

    const addWorkExperience = () => {
        setWorkExperiences([
            ...workExperiences,
            { company: "", position: "", startDate: "", endDate: "", description: "", isCurrent: false },
        ]);
    };

    const removeWorkExperience = (index) => {
        const updatedWork = [...workExperiences];
        updatedWork.splice(index, 1);
        setWorkExperiences(updatedWork);
    };

    const handleCheckboxChange = (index, checked) => {
        const updatedWork = [...workExperiences];
        updatedWork[index].isCurrent = checked;
        if (checked) updatedWork[index].endDate = ""; // Clear endDate if currently working
        setWorkExperiences(updatedWork);
        form.setValue(`workExperiences.${index}.isCurrent`, checked);
        form.setValue(`workExperiences.${index}.endDate`, "");
    };

    return (
        <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
            {isSubmitted ? (
                <div className="space-y-4 text-lg">
                    <h2 className="text-xl font-semibold">Work Experience</h2>
                    {workExperiences.map((work, index) => (
                        <div key={index} className="border p-3 rounded-lg relative">
                            <p><strong>Company:</strong> {work.company}</p>
                            <p><strong>Position:</strong> {work.position}</p>
                            <p><strong>Start Date:</strong> {work.startDate}</p>
                            {!work.isCurrent && <p><strong>End Date:</strong> {work.endDate}</p>}
                            <p><strong>Description:</strong> {work.description}</p>
                            <p><strong>Currently Working:</strong> {work.isCurrent ? "Yes" : "No"}</p>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>Edit</Button>
                </div>
            ) : (
                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {workExperiences.map((work, index) => (
                            <div key={index} className="border p-4 rounded-lg space-y-3 relative">
                                {/* ❌ Remove button */}
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                    onClick={() => removeWorkExperience(index)}
                                >
                                    <X size={20} />
                                </button>

                                <h3 className="text-lg font-semibold">Work Experience {index + 1}</h3>
                                
                                {["company", "position", "startDate", "description"].map((fieldName) => (
                                    <FormField
                                        key={fieldName}
                                        control={form.control}
                                        name={`workExperiences.${index}.${fieldName}`}
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

                                {/* End Date - Hide if "Currently Working" is checked */}
                                {!workExperiences[index].isCurrent && (
                                    <FormField
                                        control={form.control}
                                        name={`workExperiences.${index}.endDate`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>End Date</FormLabel>
                                                <FormControl>
                                                    <Input {...field} type="date" required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {/* "Currently Working" Checkbox */}
                                <FormField
                                    control={form.control}
                                    name={`workExperiences.${index}.isCurrent`}
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => handleCheckboxChange(index, checked)}
                                                />
                                            </FormControl>
                                            <FormLabel>Currently Working Here</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}

                        <Button type="button" variant="outline" onClick={addWorkExperience}>Add Another Experience</Button>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            )}
        </Card>
    );
}

export default WorkInfo;
