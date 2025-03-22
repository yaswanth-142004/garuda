import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

function PublicationInfo({ formRef, onSuccess }) {
    const [publications, setPublications] = useState([
        { title: "", publisher: "", publicationDate: "", description: "", link: "" },
    ]);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({ defaultValues: { publications } });

    const onSubmit = (data) => {
        console.log("Submitted Data:", data);
        setPublications(data.publications);
        setIsSubmitted(true);
        onSuccess?.();
    };

    const addPublication = () => {
        setPublications([...publications, { title: "", publisher: "", publicationDate: "", description: "", link: "" }]);
    };

    const removePublication = (index) => {
        const updated = publications.filter((_, i) => i !== index);
        setPublications(updated);
        form.setValue("publications", updated);
    };

    return (
        <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
            {isSubmitted ? (
                <div className="space-y-4 text-lg">
                    <h2 className="text-xl font-semibold">Publications</h2>
                    {publications.map((pub, index) => (
                        <div key={index} className="border p-3 rounded-lg">
                            <p><strong>Title:</strong> {pub.title}</p>
                            <p><strong>Publisher:</strong> {pub.publisher}</p>
                            <p><strong>Publication Date:</strong> {pub.publicationDate}</p>
                            <p><strong>Description:</strong> {pub.description}</p>
                            <p><strong>Link:</strong> <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">{pub.link}</a></p>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>Edit</Button>
                </div>
            ) : (
                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {publications.map((pub, index) => (
                            <div key={index} className="border p-4 rounded-lg space-y-3 relative">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                    onClick={() => removePublication(index)}
                                >
                                    <X size={20} />
                                </button>
                                <h3 className="text-lg font-semibold">Publication {index + 1}</h3>

                                {["title", "publisher", "publicationDate", "description", "link"].map((fieldName) => (
                                    <FormField
                                        key={fieldName}
                                        control={form.control}
                                        name={`publications.${index}.${fieldName}`}
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
                        <Button type="button" variant="outline" onClick={addPublication}>Add Another Publication</Button>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            )}
        </Card>
    );
}

export default PublicationInfo;
