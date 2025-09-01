import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SettingsContent = ({
  open,
  setOpen,
  passwordForm,
  setPasswordForm,
  errors,
  setErrors,
  handlePasswordChange,
  validateForm,
  handleSubmitPassword,
  closeDialog,
  fetchAllData,
  loading
}) => {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 text-sm lg:text-base">Configure system preferences and security settings</p>
      </div>

      <div className="grid gap-4 lg:gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
          <div className="space-y-3 lg:space-y-4">
            <AlertDialog open={open} onOpenChange={(isOpen) => {
              if (!isOpen) {
                closeDialog();
              } else {
                setOpen(true);
              }
            }}>
              <AlertDialogTrigger asChild>
                <button className="w-full text-left p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm lg:text-base">Change Password</h4>
                  <p className="text-xs lg:text-sm text-gray-600 mt-1">Update your admin password</p>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent
                className="sm:max-w-md"
                onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>Change Password</AlertDialogTitle>
                  <AlertDialogDescription>
                    Enter your current password and choose a new one.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => { handlePasswordChange('currentPassword', e.target.value) }}
                      placeholder="Enter current password"
                      className={errors.currentPassword ? 'border-red-500' : ''}
                    />
                    {errors.currentPassword && (
                      <p className="text-red-500 text-sm">{errors.currentPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder="Enter new password"
                      className={errors.newPassword ? 'border-red-500' : ''}
                    />
                    {errors.newPassword && (
                      <p className="text-red-500 text-sm">{errors.newPassword}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder="Confirm new password"
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>

                  {errors.submit && (
                    <p className="text-red-500 text-sm">{errors.submit}</p>
                  )}
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel onClick={closeDialog}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleSubmitPassword}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <button
              onClick={fetchAllData}
              className="w-full text-left p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 text-sm lg:text-base">Refresh All Data</h4>
              <p className="text-xs lg:text-sm text-gray-600 mt-1">Reload all dashboard information</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsContent;