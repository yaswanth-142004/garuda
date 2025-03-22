import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Globe, Linkedin, Github, Twitter, MessagesSquare, Code, User } from "lucide-react";

const socialPlatforms = {
    linkedIn: { label: "LinkedIn", icon: <Linkedin className="w-5 h-5 text-blue-600" /> },
    github: { label: "GitHub", icon: <Github className="w-5 h-5 text-gray-700" /> },
    twitter: { label: "Twitter", icon: <Twitter className="w-5 h-5 text-blue-500" /> },
    website: { label: "Website", icon: <Globe className="w-5 h-5 text-green-600" /> },
    medium: { label: "Medium", icon: <MessagesSquare className="w-5 h-5 text-black" /> },
    stackOverflow: { label: "Stack Overflow", icon: <Code className="w-5 h-5 text-orange-500" /> },
    leetcode: { label: "LeetCode", icon: <Code className="w-5 h-5 text-yellow-600" /> },
};

function SocialInfo({ formRef, onSuccess }) {
    const [socials, setSocials] = useState({
        linkedIn: "",
        github: "",
        twitter: "",
        website: "",
        medium: "",
        stackOverflow: "",
        leetcode: "",
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const form = useForm({ defaultValues: { socials } });

    const onSubmit = (data) => {
        console.log("Submitted Data:", data);
        setSocials(data.socials);
        setIsSubmitted(true);
        onSuccess?.();
    };

    return (
        <Card className="p-6 w-full max-w-3xl bg-background border-none shadow-none">
            {isSubmitted ? (
                <div className="space-y-4 text-lg">
                    <h2 className="text-xl font-semibold">Social Links</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(socials).map(([key, value]) => (
                            value && (
                                <div key={key} className="flex items-center space-x-2 border p-2 rounded-lg">
                                    {socialPlatforms[key]?.icon || <User className="w-5 h-5 text-gray-500" />}
                                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                        {socialPlatforms[key]?.label || key}
                                    </a>
                                </div>
                            )
                        ))}
                    </div>
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>Edit</Button>
                </div>
            ) : (
                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Grid layout for form fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(socials).map(([key]) => (
                                <FormField
                                    key={key}
                                    control={form.control}
                                    name={`socials.${key}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center space-x-2">
                                                {socialPlatforms[key]?.icon || <User className="w-5 h-5 text-gray-500" />}
                                                <span>{socialPlatforms[key]?.label || key}</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} type="url" required placeholder="Enter your link..." />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            )}
        </Card>
    );
}

export default SocialInfo;
