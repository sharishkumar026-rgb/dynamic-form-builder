import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
}

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  disabled = false,
  fullWidth = false,
  size = "small",
}: SearchInputProps) => {
  const handleClear = () => {
    onChange("");
  };

  return (
    <TextField
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      fullWidth={fullWidth}
      size={size}
      variant="outlined"
      sx={{
        width: fullWidth ? "100%" : 320,
        maxWidth: "100%",
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClear}
                edge="end"
                size="small"
                disabled={disabled}
                aria-label="Clear search"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default SearchInput;