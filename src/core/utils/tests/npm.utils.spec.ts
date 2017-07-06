import {NpmUtils} from '../npm.utils';
import * as sinon from 'sinon';
import * as child_process from 'child_process';
import {EventEmitter} from 'events';

describe('NpmUtils', () => {
  let sandbox: sinon.SinonSandbox;
  beforeEach(() => sandbox = sinon.sandbox.create());
  afterEach(() => sandbox.restore());

  let spawnStub: sinon.SinonStub;
  let event: EventEmitter;
  beforeEach(() => {
    event = new EventEmitter();
    spawnStub = sandbox.stub(child_process, 'spawn').callsFake(() => {
      return event.addListener('exit', () => () => 0);
    });
  });

  describe('#update()', () => {
    it('should spawn a child process to update package.json dependencies', () => {
      const promise: Promise<void> = NpmUtils.update([
        'dep1',
        'dep2',
        'dep3'
      ]);
      event.emit('exit');
      return promise.then(() => {
          sinon.assert.calledWith(spawnStub, 'npm', [
            'update',
            '--save',
            'dep1',
            'dep2',
            'dep3'
          ]);
        });
    });
  });

  describe('#uninstall()', () => {
    it('should spawn a child process to update package.json dependencies', () => {
      const promise: Promise<void> = NpmUtils.uninstall([
        'dep1',
        'dep2',
        'dep3'
      ]);
      event.emit('exit');
      return promise
        .then(() => {
          sinon.assert.calledWith(spawnStub, 'npm', [
            'uninstall',
            '--save',
            'dep1',
            'dep2',
            'dep3'
          ]);
        });
    });
  });
});
