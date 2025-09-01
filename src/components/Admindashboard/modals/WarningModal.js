import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Info, AlertTriangle, Zap, Send } from 'lucide-react';

const WarningModal = ({
  warningModal,
  setWarningModal,
  warningForm,
  setWarningForm,
  handleSendWarningdemo
}) => {
  const getSeverityConfig = (severity) => {
    const configs = {
      low: {
        icon: Info,
        color: 'bg-blue-50 text-blue-600 border-blue-200',
        badge: 'bg-blue-100 text-blue-800',
        iconBg: 'bg-blue-100',
        label: 'Reminder',
        description: 'A gentle reminder about policies or expectations'
      },
      medium: {
        icon: AlertTriangle,
        color: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        badge: 'bg-yellow-100 text-yellow-800',
        iconBg: 'bg-yellow-100',
        label: 'Warning',
        description: 'An official warning about behavior or performance'
      },
      high: {
        icon: Zap,
        color: 'bg-red-50 text-red-600 border-red-200',
        badge: 'bg-red-100 text-red-800',
        iconBg: 'bg-red-100',
        label: 'Final Warning',
        description: 'A final warning before disciplinary action'
      }
    };
    return configs[severity] || configs.medium;
  };

  const currentConfig = getSeverityConfig(warningForm.severity);
  const IconComponent = currentConfig.icon;

  return (
    <Dialog open={warningModal} onOpenChange={setWarningModal}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentConfig.iconBg}`}>
              <IconComponent className={`h-5 w-5 ${currentConfig.color.split(' ')[1]}`} />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Send Warning
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                Issue an official warning to the user
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-6">
          <div className="space-y-3">
            <Label htmlFor="severity" className="text-sm font-medium text-gray-700">
              Severity Level
            </Label>
            <Select
              value={warningForm.severity}
              onValueChange={(value) => setWarningForm({ ...warningForm, severity: value })}
            >
              <SelectTrigger id="severity" className="w-full">
                <SelectValue placeholder="Select severity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span>Low - Reminder</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span>Medium - Warning</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-red-500" />
                    <span>High - Final Warning</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className={`p-3 rounded-lg border ${currentConfig.color}`}>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className={currentConfig.badge}>
                  {currentConfig.label}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">
                {currentConfig.description}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">
              Warning Message
            </Label>
            <Textarea
              id="message"
              value={warningForm.message}
              onChange={(e) => setWarningForm({ ...warningForm, message: e.target.value })}
              placeholder="Enter the warning message details..."
              className="min-h-[120px] resize-none"
            />
            <p className="text-xs text-gray-500">
              Be specific about the issue and expected behavior changes.
            </p>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setWarningModal(false)}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendWarningdemo}
              disabled={!warningForm.message}
              className={`flex-1 sm:flex-none gap-2 ${warningForm.severity === 'high'
                ? 'bg-red-600 hover:bg-red-700'
                : warningForm.severity === 'low'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
            >
              <Send className="h-4 w-4" />
              Send Warning
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarningModal;