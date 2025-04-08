import React, { useState } from "react";
import { Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./HeaderSimple.module.css";
import { Link } from "react-router-dom";
import { ColorSchemeIcon } from "../ColorSchemeIcon/ColorSchemeIcon.jsx";
import { LogOut } from "lucide-react";

export function HeaderSimple() {
  const [opened, { toggle }] = useDisclosure(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <header className={classes.header}>
      <Container size="xl" className={classes.inner}>
        <Link to="/">
          <img
            className="w-10"
            alt="Logo"
            src="https://png.pngtree.com/png-vector/20240629/ourmid/pngtree-money-3d-icon-finance-png-image_12920735.png"
          />
        </Link>

        <Group gap={50} visibleFrom="xs">
          {isAuthenticated && (
            <>
              <Link
                className="flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200"
                to="/profile"
              >
                <img
                  className="w-10 rounded-full"
                  src="https://thumbs.dreamstime.com/b/generative-ai-young-smiling-man-avatar-man-brown-beard-mustache-hair-wearing-yellow-sweater-sweatshirt-d-vector-people-279560903.jpg"
                  alt="Profile"
                />
              </Link>
              <Link
                className={`bg-red-400 hover:bg-red-500 rounded  flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200`}
              >
                Logout
              </Link>
            </>
          )}
          <ColorSchemeIcon />
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
