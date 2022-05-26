import { ChakraProvider, Box, theme } from "@chakra-ui/react";
import { Timetable } from "./containers/timetable";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box padding="20px">
      <Timetable />
    </Box>
  </ChakraProvider>
);
