
import { useState, type MouseEvent } from "react";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface MostUsedForm {
  id: number | string;
  title: string;
  responseCount: number;
  isActive?: boolean;
}

interface MostUsedFormsProps {
  forms?: MostUsedForm[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  onView?: (form: MostUsedForm) => void;
}

const MostUsedForms = ({
  forms = [],
  title = "Most Used Forms",
  subtitle = "Forms with the highest number of responses",
  loading = false,
  onView,
}: MostUsedFormsProps) => {
  const [anchorEl, setAnchorEl] =
    useState<HTMLElement | null>(null);

  const [selectedForm, setSelectedForm] =
    useState<MostUsedForm | null>(null);

  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (
    event: MouseEvent<HTMLElement>,
    form: MostUsedForm,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedForm(form);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedForm(null);
  };

  const handleView = () => {
    if (selectedForm && onView) {
      onView(selectedForm);
    }

    handleMenuClose();
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          {loading && (
            <Stack spacing={1.5}>
              {[1, 2, 3, 4].map((item) => (
                <Box
                  key={item}
                  sx={{
                    width: "100%",
                    height: 58,
                    borderRadius: 1,
                    backgroundColor: "action.hover",
                  }}
                />
              ))}
            </Stack>
          )}

          {!loading && forms.length === 0 && (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
              }}
            >
              <DescriptionOutlinedIcon
                sx={{
                  fontSize: 42,
                  color: "text.disabled",
                  mb: 1,
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                }}
              >
                No form usage data
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Form usage statistics will appear here.
              </Typography>
            </Box>
          )}

          {!loading && forms.length > 0 && (
            <List disablePadding>
              {forms.map((form, index) => (
                <ListItem
                  key={form.id}
                  disableGutters
                  secondaryAction={
                    onView ? (
                      <IconButton
                        edge="end"
                        size="small"
                        aria-label={`Actions for ${form.title}`}
                        onClick={(event) =>
                          handleMenuOpen(event, form)
                        }
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    ) : undefined
                  }
                  sx={{
                    px: 1,
                    py: 1.25,
                    borderRadius: 1.5,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 42,
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "action.hover",
                        color: "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </Box>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          fontWeight: 600,
                          pr: 4,
                        }}
                      >
                        {form.title}
                      </Typography>
                    }
                    secondary={
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {form.responseCount}{" "}
                          {form.responseCount === 1
                            ? "response"
                            : "responses"}
                        </Typography>

                        {form.isActive !== undefined && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: form.isActive
                                ? "success.main"
                                : "text.secondary",
                            }}
                          >
                            {form.isActive
                              ? "Active"
                              : "Inactive"}
                          </Typography>
                        )}
                      </Stack>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleView}>
              View Form
            </MenuItem>
          </Menu>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MostUsedForms;

