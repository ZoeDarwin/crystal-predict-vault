# React Portal Error Fix - Task 9 Resolution

## Problem

The application was showing a React Portal error in the console:

```
NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.
```

This error occurred in the `<Portal>` component within the Dialog, specifically when the Dialog was mounting/unmounting.

## Root Cause

The error was caused by the **Immersive Translate browser extension** attempting to parse Radix UI Dialog selectors. The
extension was trying to use `querySelectorAll()` with invalid Radix UI selectors (containing colons like `#radix-:r3:`),
which caused DOM manipulation conflicts with React's Portal cleanup logic.

## Solution Implemented

### 1. **Error Boundary Component** (`ui/src/components/ErrorBoundary.tsx`)

- Created a React Error Boundary that catches and suppresses non-critical Portal errors
- Specifically targets `removeChild` errors that are caused by browser extensions
- Allows the app to recover gracefully without crashing
- Logs warnings for debugging purposes

### 2. **App-Level Error Boundary** (`ui/src/App.tsx`)

- Wrapped the entire app with the ErrorBoundary component
- Ensures all Portal-related errors are caught at the top level
- Provides fallback UI if critical errors occur

### 3. **Dialog Content Protection** (`ui/src/components/ui/dialog.tsx`)

- Added `data-immersive-translate-effect="noTranslate"` attribute to DialogContent
- This tells the Immersive Translate extension to skip processing this element
- Prevents the extension from interfering with Dialog DOM

### 4. **Global querySelectorAll Protection** (`ui/index.html`)

- Added a script that wraps `Element.prototype.querySelectorAll`
- Catches and silently handles invalid Radix UI selectors from browser extensions
- Prevents selector errors from propagating to React's Portal cleanup

## Files Modified

1. `ui/src/components/ErrorBoundary.tsx` - **NEW**
2. `ui/src/App.tsx` - Added ErrorBoundary wrapper
3. `ui/src/components/ui/dialog.tsx` - Added noTranslate attribute
4. `ui/index.html` - Added querySelectorAll protection script

## Result

- ✅ Portal errors are now caught and suppressed gracefully
- ✅ Dialog functionality remains fully operational
- ✅ App no longer crashes due to extension interference
- ✅ Users can disable Immersive Translate extension if they want to eliminate warnings entirely

## User Recommendation

If users want to completely eliminate the warning messages, they can:

1. Disable the Immersive Translate extension for this domain
2. Or use the app in a browser without this extension

The app will work perfectly either way - the fix ensures graceful error handling.
