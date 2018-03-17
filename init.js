// Your init script
//
// Atom will evaluate this file each time a new window is opened. It is run
// after packages are loaded/activated and after the previous editor state
// has been restored.
//
// An example hack to log to the console when each text editor is saved.
//
// atom.workspace.observeTextEditors (editor) ->
//   editor.onDidSave ->
//     console.log "Saved! #{editor.getPath()}"
'use babel';


// CONFIGS

// disable alt from accessing the menu bar (so we can bind others keys)
atom.menu.template.forEach(function(t) {
    return t.label = t.label.replace("&", "");
});
atom.menu.update();


// COMMANDS

// deselect current text
atom.commands.add('atom-text-editor', 'custom:deselect-text', function(e) {
    var _editor, i, len, ref, results, selection;
    _editor = atom.workspace.getActiveTextEditor();
    ref = _editor.getSelections();
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
        selection = ref[i];
        if (selection.isEmpty()) {
            results.push(e.abortKeyBinding());
        } else {
            results.push(selection.clear());
        }
    }
    return results;
});

// join line above
atom.commands.add('atom-text-editor', 'custom:join-line-above', function(e) {
    var editor;
    if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
    }
    return editor.transact(function() {
        editor.moveUp();
        return editor.joinLines();
    });
});

// clear line
atom.commands.add('atom-text-editor', 'custom:clear-line', function(e) {
    var editor;
    if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
    }
    return editor.transact(function() {
        editor.deleteLine();
        return editor.insertNewlineAbove();
    });
});

// shift-enter (open line above)
atom.commands.add('atom-text-editor', 'custom:shift-enter', function(e) {
    var editor;
    if (!(editor = atom.workspace.getActiveTextEditor())) {
        return;
    }
    return editor.transact(function() {
        var i, j, len, len1, ref, ref1, results, selectedTexts, selection;
        ref = editor.getSelections();
        for (i = 0, len = ref.length; i < len; i++) {
            selection = ref[i];
            selection.deleteSelectedText();
        }
        editor.selectToBeginningOfLine();
        selectedTexts = [];
        ref1 = editor.getSelections();
        results = [];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
            selection = ref1[j];
            results.push(selectedTexts.push(selection.getText()));
        }
        return results;
    });
});


// custom tab behavior
atom.commands.add('atom-text-editor', 'custom:tab-autocomplete', function(e) {
    const editor = atom.workspace.getActiveTextEditor();
    if (!editor) {
        return e.abortKeyBinding();
    } else {
        const cursors = editor.getCursors();
        let hasPrecedingCharsFlag = true;
        for (let cursor of cursors) {
            console.log(cursor);
            if (!cursor.hasPrecedingCharactersOnLine()) hasPrecedingCharsFlag = false;
        }
        // at this point flag will only be true if all cursors have preceding chars
        if (hasPrecedingCharsFlag) {
            editorElement = atom.views.getView(editor);
            // this can help later: https://atom.io/docs/api/v1.6.0/CommandRegistry#instance-onDidDispatch
            return atom.commands.dispatch(editorElement, 'autocomplete-plus:activate');
        } else {
            return e.abortKeyBinding();
        }
    }
});
