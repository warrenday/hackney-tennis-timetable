import { ChakraProvider, Box, theme } from "@chakra-ui/react";
import { Timetable } from "./containers/timetable";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box paddingX="0" paddingY="20px">
      <Timetable />
    </Box>
  </ChakraProvider>
);
