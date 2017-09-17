# Your init script
#
# Atom will evaluate this file each time a new window is opened. It is run
# after packages are loaded/activated and after the previous editor state
# has been restored.
#
# An example hack to log to the console when each text editor is saved.
#
# atom.workspace.observeTextEditors (editor) ->
#   editor.onDidSave ->
#     console.log "Saved! #{editor.getPath()}"

# deselect current text
atom.commands.add 'atom-text-editor', 'custom:deselect-text', (e) ->
    _editor = atom.workspace.getActiveTextEditor()
    for selection in _editor.getSelections()
        if selection.isEmpty()
            e.abortKeyBinding()
        else
            selection.clear()


# disable alt from accessing the menu bar (so we can bind others keys)
atom.menu.template.forEach (t) ->
    t.label = t.label.replace("&", "")
atom.menu.update()
