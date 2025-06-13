import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// import { EditorSettings } from './editor-settings';
import { ProjectSettings } from './project-settings';

interface SettingsDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ isOpen, onOpenChange }: SettingsDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='max-h-[80vh] max-w-[90vw] overflow-y-auto rounded-lg sm:max-w-screen-sm'>
				<DialogHeader className='mb-4'>
					<DialogTitle>Settings</DialogTitle>
				</DialogHeader>
				<ProjectSettings />
				{/* <Tabs defaultValue="project">
          <TabsList className="mb-4 mt-2">
            <TabsTrigger value="project">Project</TabsTrigger>
            <TabsTrigger value="editor">Editor</TabsTrigger>
          </TabsList>
          <TabsContent value="project">
            <ProjectSettings />
          </TabsContent>
          <TabsContent value="editor">
            <EditorSettings />
          </TabsContent>
        </Tabs> */}
				{/* <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={false}>
            Save
          </Button>
        </DialogFooter> */}
			</DialogContent>
		</Dialog>
	);
}
