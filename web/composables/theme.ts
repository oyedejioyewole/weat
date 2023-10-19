import {
  argbFromHex,
  hexFromArgb,
  themeFromSourceColor,
} from "@material/material-color-utilities";

export const useSetTheme = () => {
  const { schemes } = themeFromSourceColor(argbFromHex("#5c87e4"));

  const colors = {} as {
    [colorName: string]: string;
  };

  Object.keys(schemes.light.toJSON()).forEach((colorName) => {
    colors[colorName] = hexFromArgb(schemes.light[colorName]);
  });

  document.documentElement.style.setProperty(
    "--md-sys-color-primary",
    colors.primary,
  );
  document.documentElement.style.setProperty(
    "--md-sys-color-primary-container",
    colors.primaryContainer,
  );
  document.documentElement.style.setProperty(
    "--md-sys-color-on-primary",
    colors.onPrimary,
  );

  document.documentElement.style.setProperty(
    "--md-sys-color-secondary",
    colors.secondary,
  );
  document.documentElement.style.setProperty(
    "--md-sys-color-secondary-container",
    colors.secondaryContainer,
  );
  document.documentElement.style.setProperty(
    "--md-sys-color-on-secondary",
    colors.onSecondary,
  );

  document.documentElement.style.setProperty(
    "--md-sys-color-on-surface",
    colors.onSurface,
  );
  document.documentElement.style.setProperty(
    "--md-sys-color-on-surface-variant",
    colors.onSurfaceVariant,
  );

  document.documentElement.style.setProperty(
    "--md-sys-color-outline",
    colors.outline,
  );
  document.documentElement.style.setProperty(
    "--md-sys-color-outline-variant",
    colors.outlineVariant,
  );
};
