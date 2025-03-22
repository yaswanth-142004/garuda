import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function PersonalInfo({ formRef, onSuccess }) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            address: {
                street: "",
                city: "",
                state: "",
                country: "",
                zipCode: "",
            },
            resume: null,
        },
    });

    const onSubmit = (data) => {
        console.log(data);
        setIsSubmitted(true);
        onSuccess();
    };

    return (
        <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
            {isSubmitted ? (
                <div className="space-y-4 text-lg">
                    <p><strong>Name:</strong> {form.getValues("firstName")} {form.getValues("lastName")}</p>
                    <p><strong>Email:</strong> {form.getValues("email")}</p>
                    <p><strong>Phone:</strong> {form.getValues("phone")}</p>
                    <p><strong>Date of Birth:</strong> {form.getValues("dateOfBirth")}</p>
                    <p><strong>Address:</strong> {form.getValues("address.street")}, {form.getValues("address.city")}, {form.getValues("address.state")}, {form.getValues("address.country")} - {form.getValues("address.zipCode")}</p>
                    <p><strong>Resume:</strong> {form.getValues("resume") ? "Uploaded" : "Not Uploaded"}</p>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>Edit</Button>
                </div>
            ) : (
                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="firstName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="lastName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Date of Birth</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Address Fields */}
                        <div className="grid grid-cols-2 gap-4">
                            {["street", "city", "state", "country", "zipCode"].map((fieldName) => (
                                <FormField
                                    key={fieldName}
                                    control={form.control}
                                    name={`address.${fieldName}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</FormLabel>
                                            <FormControl>
                                                <Input {...field} required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                        {/* Resume Upload */}
                        <FormField control={form.control} name="resume" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Resume</FormLabel>
                                <FormControl>
                                    <Input type="file" accept=".pdf,.docx" onChange={(e) => form.setValue("resume", e.target.files[0])} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            )}
        </Card>
    );
}

export default PersonalInfo;
