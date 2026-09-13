import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

export interface UserRoleOption {
  id: number | string;
  name: string;
}

interface UserRoleSelectProps {
  value?: number | string;
  roles?: UserRoleOption[];
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  loading?: boolean;
  onChange?: (value: number | string) => void;
}

const UserRoleSelect = ({
  value = "",
  roles = [],
  label = "Role",
  error = false,
  helperText,
  disabled = false,
  required = false,
  loading = false,
  onChange,
}: UserRoleSelectProps) => {
  const selectValue = value === undefined || value === null ? "" : String(value);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value;

    const matchedRole = roles.find(
      (role) => String(role.id) === selectedValue,
    );

    onChange?.(matchedRole ? matchedRole.id : selectedValue);
  };

  return (
    <FormControl
      fullWidth
      error={error}
      required={required}
      disabled={disabled || loading}
    >
      <InputLabel id="user-role-select-label">{label}</InputLabel>

      <Select
        labelId="user-role-select-label"
        value={selectValue}
        label={label}
        onChange={handleChange}
        IconComponent={ExpandMoreIcon}
        displayEmpty
        sx={{
          borderRadius: 2,
        }}
      >
        <MenuItem value="">
          <em>Select role</em>
        </MenuItem>

        {roles.map((role) => (
          <MenuItem key={String(role.id)} value={String(role.id)}>
            {role.name}
          </MenuItem>
        ))}
      </Select>

      {loading && (
        <FormHelperText>
          Loading roles...
        </FormHelperText>
      )}

      {!loading && helperText && (
        <FormHelperText>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default UserRoleSelect;