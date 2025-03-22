import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react"; // Import close icon

function AcademicInfo({ formRef, onSuccess }) {
    const [academicEntries, setAcademicEntries] = useState([
        {
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            description: "",
            grade: "",
        },
    ]);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({
        defaultValues: {
            academics: academicEntries,
        },
    });

    const onSubmit = (data) => {
        setAcademicEntries(data.academics);
        setIsSubmitted(true);
        onSuccess();
    };

    const addEntry = () => {
        setAcademicEntries([...academicEntries, {
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            description: "",
            grade: "",
        }]);
    };

    const removeEntry = (index) => {
        const updatedEntries = [...academicEntries];
        updatedEntries.splice(index, 1);
        setAcademicEntries(updatedEntries);
    };

    return (
        <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
            {isSubmitted ? (
                <div className="space-y-4 text-lg">
                    <h2 className="text-xl font-semibold">Academic Information</h2>
                    {academicEntries.map((entry, index) => (
                        <div key={index} className="border p-3 rounded-lg relative">
                            <p><strong>Institution:</strong> {entry.institution}</p>
                            <p><strong>Degree:</strong> {entry.degree}</p>
                            <p><strong>Field of Study:</strong> {entry.fieldOfStudy}</p>
                            <p><strong>Start Date:</strong> {entry.startDate}</p>
                            <p><strong>End Date:</strong> {entry.endDate}</p>
                            <p><strong>Grade:</strong> {entry.grade}</p>
                            <p><strong>Description:</strong> {entry.description}</p>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>Edit</Button>
                </div>
            ) : (
                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {academicEntries.map((_, index) => (
                            <div key={index} className="border p-4 rounded-lg space-y-3 relative">
                                {/* ❌ Remove button */}
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                    onClick={() => removeEntry(index)}
                                >
                                    <X size={20} />
                                </button>

                                <h3 className="text-lg font-semibold">Entry {index + 1}</h3>

                                {["institution", "degree", "fieldOfStudy", "startDate", "endDate", "grade", "description"].map((fieldName) => (
                                    <FormField
                                        key={fieldName}
                                        control={form.control}
                                        name={`academics.${index}.${fieldName}`}
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
                            </div>
                        ))}

                        <Button type="button" variant="outline" onClick={addEntry}>Add Another</Button>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            )}
        </Card>
    );
}

export default AcademicInfo;
