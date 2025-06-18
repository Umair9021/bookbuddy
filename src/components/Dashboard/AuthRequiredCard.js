
import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '../ui/button';
import {LogIn} from 'lucide-react';

const AuthRequiredCard = ()=>{
     return (
            <div className="min-h-screen flex flex-col bg-muted">
                <Navbar />
                <Card className="w-[500px] m-auto shadow-lg mt-15">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-gray-800">
                            Authentication Required
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                            Please login to see dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <Button
                            onClick={() => router.push('/auth/login')}
                            className="bg-blue-600 hover:bg-blue-700 gap-2"
                        >
                            <LogIn className="h-4 w-4" />
                            Login Now
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/auth/signup')}
                        >
                            Create Account
                        </Button>
                    </CardContent>
                </Card>
                <Footer />
            </div>
        );

}

export default AuthRequiredCard;