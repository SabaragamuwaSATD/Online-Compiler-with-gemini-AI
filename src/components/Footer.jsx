// src/components/Header.jsx
import React from "react";
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { FaSun, FaMoon } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box bg="purple.600" px={4} py={2} color="white">
      <Flex h={10} alignItems="center" justifyContent="space-between">
        {/* <HStack spacing={8} alignItems="center">
          <Box fontWeight="bold" fontSize="lg">
            My Web App
          </Box>
          <HStack as="nav" spacing={4} display={{ base: "none", md: "flex" }}>
            <Link
              as={RouterLink}
              to="/"
              px={2}
              py={1}
              rounded="md"
              _hover={{ bg: "purple.700" }}
            >
              Home
            </Link>
            <Link
              as={RouterLink}
              to="/about"
              px={2}
              py={1}
              rounded="md"
              _hover={{ bg: "purple.700" }}
            >
              About
            </Link>
            <Link
              as={RouterLink}
              to="/contact"
              px={2}
              py={1}
              rounded="md"
              _hover={{ bg: "purple.700" }}
            >
              Contact
            </Link>
          </HStack>
        </HStack>
        <IconButton
          size="md"
          icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
          aria-label="Toggle color mode"
          onClick={toggleColorMode}
        /> */}
      </Flex>
    </Box>
  );
};

export default Footer;
