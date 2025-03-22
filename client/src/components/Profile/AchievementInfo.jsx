import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

function AchievementInfo({ formRef, onSuccess }) {
    const [achievements, setAchievements] = useState([
        { title: "", description: "", date: "", issuer: "" },
    ]);

    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm({ defaultValues: { achievements } });

    const onSubmit = (data) => {
        console.log(data);
        setAchievements(data.achievements);
        setIsSubmitted(true);
        onSuccess();
    };

    const addAchievement = () => {
        setAchievements([...achievements, { title: "", description: "", date: "", issuer: "" }]);
    };

    const removeAchievement = (index) => {
        const updated = achievements.filter((_, i) => i !== index);
        setAchievements(updated);
        form.setValue("achievements", updated);
    };

    return (
        <Card className="p-4 w-full max-w-3xl bg-background border-none shadow-none">
            {isSubmitted ? (
                <div className="space-y-4 text-lg">
                    <h2 className="text-xl font-semibold">Achievements</h2>
                    {achievements.map((achieve, index) => (
                        <div key={index} className="border p-3 rounded-lg">
                            <p><strong>Title:</strong> {achieve.title}</p>
                            <p><strong>Description:</strong> {achieve.description}</p>
                            <p><strong>Date:</strong> {achieve.date}</p>
                            <p><strong>Issuer:</strong> {achieve.issuer}</p>
                        </div>
                    ))}
                    <Button variant="outline" onClick={() => setIsSubmitted(false)}>Edit</Button>
                </div>
            ) : (
                <Form {...form}>
                    <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {achievements.map((achieve, index) => (
                            <div key={index} className="border p-4 rounded-lg space-y-3 relative">
                                <button
                                    type="button"
                                    className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
                                    onClick={() => removeAchievement(index)}
                                >
                                    <X size={20} />
                                </button>
                                <h3 className="text-lg font-semibold">Achievement {index + 1}</h3>

                                {["title", "description", "date", "issuer"].map((fieldName) => (
                                    <FormField
                                        key={fieldName}
                                        control={form.control}
                                        name={`achievements.${index}.${fieldName}`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {fieldName.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
                                                </FormLabel>
                                                <FormControl>
                                                    {fieldName === "description" ? (
                                                        <Textarea {...field} required />
                                                    ) : (
                                                        <Input {...field} type={fieldName === "date" ? "date" : "text"} required />
                                                    )}
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}

                            </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addAchievement}>Add Another Achievement</Button>
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            )}
        </Card>
    );
}

export default AchievementInfo;
