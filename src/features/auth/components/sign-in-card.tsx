import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { SignInFlow } from "../types";

type Props = {
  setState: (state: SignInFlow) => void;
};

const SignInCard = ({ setState }: Props) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState("");

  const onPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);

    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid Email or Password");
      })
      .finally(() => {
        setPending(false);
      });
  };

  const onProvider = (value: "github" | "google") => {
    setPending(true);
    signIn(value).finally(() => {
      setPending(false);
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto p-8 sm:p-10 md:p-12">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Log In to continue</CardTitle>
        <CardDescription>
          use your email or another serveice to continue
        </CardDescription>
      </CardHeader>
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onPassword} className="space-y-2.5">
          <Input
            disabled={pending}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            placeholder="email"
            type="email"
            required
          />
          <Input
            disabled={pending}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="password"
            type="password"
            required
          />
          <Button
            type="submit"
            className="w-full"
            size={"lg"}
            disabled={pending}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col sm:flex-row justify-between gap-y-2.5">
          <Button
            className="gap-2 w-full sm:w-1/2 mr-0 sm:mr-2"
            disabled={pending}
            onClick={() => onProvider("google")}
          >
            Continue with
            <FcGoogle />
          </Button>
          <Button
            className="gap-2 w-full sm:w-1/2 ml-0 sm:ml-2"
            disabled={pending}
            onClick={() => onProvider("github")}
          >
            Continue with
            <FaGithub />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            className="text-sky-600 hover:underline cursor-pointer"
            onClick={() => setState("signUp")}
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;
