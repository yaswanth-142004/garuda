import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

function CertificationInfo({ formRef, onSuccess }) {
    const [certifications, setCertifications] = useState([
        {
            name: "",
            issuingOrganization: "",
            issueDate: "",
            expirationDate: "",
            credentialId: "",
            credentialURL: "",
        },
    ]);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({ defaultValues: { certifications } });

    const onSubmit = (data) => {
        console.log(data);
        setCertifications(data.certifications);
        setIsSubmitted(true);
        onSuccess();
    };

    const addCertification = () => {
        setCertifications([...certifications, {
            name: "",
            issuingOrganization: "",
            issueDate: "",
            expirationDate: "",
            credentialId: "",
            credentialURL: ""
        }]);
    };

    const removeCertification = (index) => {
        const updatedCerts = certifications.filter((_, i) => i !== index);
        setCertifications(updatedCerts);
        form.setValue("certifications", updatedCerts);
    };

    return (
        <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
            {isSubmitted ? (
                <div className="space-y-4 text-lg">
                    <h2 className="text-xl font-semibold">Certifications</h2>
                    {certifications.map((cert, index) => (
                        <div key={index} className="border p-3 rounded-lg">
                            <p><strong>Name:</strong> {cert.name}</p>
                            <p><strong>Issuing Organization:</strong> {cert.issuingOrganization}</p>
                            <p><strong>Issue Date:</strong> {cert.issueDate}</p>
                            <p><strong>Expiration Date:</strong> {cert.expirationDate}</p>
                            <p><strong>Credential ID:</strong> {cert.credentialId}</p>
                            <p><strong>Credential URL:</strong> <a href={cert.credentialURL} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{cert.credentialURL}</a></p>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>Edit</Button>
                </div>
            ) : (
                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {certifications.map((cert, index) => (
                            <div key={index} className="border p-4 rounded-lg space-y-3 relative">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                    onClick={() => removeCertification(index)}
                                >
                                    <X size={20} />
                                </button>
                                <h3 className="text-lg font-semibold">Certification {index + 1}</h3>

                                {["name", "issuingOrganization", "issueDate", "expirationDate", "credentialId", "credential Url"].map((field) => (
                                    <FormField
                                        key={field}
                                        control={form.control}
                                        name={`certifications.${index}.${field}`}
                                        render={({ field: inputField }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...inputField} type={field.includes("Date") ? "date" : "text"} required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}

                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addCertification}>Add Another Certification</Button>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            )}
        </Card>
    );
}

export default CertificationInfo;
