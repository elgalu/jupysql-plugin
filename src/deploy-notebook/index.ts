import { NotebookPanel, INotebookModel } from '@jupyterlab/notebook';
import { ToolbarButton } from '@jupyterlab/apputils';
import { DocumentRegistry } from '@jupyterlab/docregistry';
import { IDisposable, DisposableDelegate } from '@lumino/disposable';

import { settingsChanged, JupySQLSettings } from '../settings';

/**
 * A notebook widget extension that adds a deployment button to the toolbar.
 */
export class DeployingExtension
    implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel>
{
    /**
     * Create a new extension for the notebook panel widget.
     *
     * @param panel Notebook panel
     * @param context Notebook context
     * @returns Disposable on the added button
     */
    constructor(
    ) {
        settingsChanged.connect(this._onSettingsChanged);
    }

    private deployNotebookButton: ToolbarButton;
    private panel: NotebookPanel;

    private _onSettingsChanged = (sender: any, settings: JupySQLSettings) => {
        if (!settings.showDeployNotebook) {
            if (this.deployNotebookButton) {
                this.deployNotebookButton.dispose();
            }
        } else {
            if (!this.deployNotebookButton) {
                this.deployNotebookButton = new ToolbarButton({
                    className: 'share-nb-button',
                    label: '_',
                    onClick: () => {},
                    tooltip: 'placeholder',
                });

                this.deployNotebookButton.node.setAttribute("data-testid", "share-btn");
            }

            this.panel.toolbar.insertItem(10, 'deployNB', this.deployNotebookButton);
        }
    }


    createNew(
        panel: NotebookPanel,
        context: DocumentRegistry.IContext<INotebookModel>
    ): IDisposable {

        this.panel = panel;

        return new DisposableDelegate(() => {
            if (this.deployNotebookButton) {
                this.deployNotebookButton.dispose();
            }
        });
    }
}
