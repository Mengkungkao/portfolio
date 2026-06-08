import { Column, Heading, Text } from "@/once-ui/components";
import AccessForm from "./AccessForm";

export default function AccessPage() {
  return (
    <Column paddingY="128" maxWidth={32} gap="24" center>
      <Column gap="12" horizontal="center">
        <Heading align="center" wrap="balance">
          Portfolio access
        </Heading>
        <Text align="center" onBackground="neutral-weak" wrap="balance">
          Please enter the password to continue to this website.
        </Text>
      </Column>

      <AccessForm />
    </Column>
  );
}
