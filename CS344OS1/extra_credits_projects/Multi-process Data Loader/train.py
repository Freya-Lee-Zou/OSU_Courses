"""
    Code for training and testing an MNIST handwritten digit classifier.
"""
import time
import json
import argparse
from tqdm import tqdm

# pytorch
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim

# torchvision
from torchvision import datasets, transforms


"""
    Global variables
"""
_best_acc = 0.


"""
    Deep Neural Network (SimpleNet) we will use 
"""
class SimpleNet(nn.Module):
    def __init__(self):
        super(SimpleNet, self).__init__()
        self.conv1 = nn.Conv2d(1, 16, 3, 1)
        self.conv2 = nn.Conv2d(16, 32, 3, 1)
        self.fc1 = nn.Linear(4608, 128)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        x = self.conv1(x)
        x = F.relu(x)
        x = self.conv2(x)
        x = F.relu(x)
        x = F.max_pool2d(x, 2)
        x = torch.flatten(x, 1)
        x = self.fc1(x)
        x = F.relu(x)
        x = self.fc2(x)
        return F.log_softmax(x, dim=1)


"""
    Train/test functions
"""
def train(args, model, train_loader, optimizer, epoch):
    model.train()

    # data-holder
    epoch_loss = 0.
    epoch_acc  = 0. 

    # epoch
    for bidx, (data, target) in enumerate( \
        tqdm(train_loader, desc=' : [train:epoch:{}]'.format(epoch))):

        optimizer.zero_grad()
        # TODO - Get the predictions for data using the model
        # TODO - Compute the cross-entropy loss between the predictions and the target

        optimizer.zero_grad()
        output = model(data)
        loss = F.nll_loss(output, target)

        loss.backward()
        optimizer.step()

        # : train loss/acc.
        epoch_loss += loss.item()
        epoch_pred  = output.argmax(dim=1, keepdim=True)                        # get the index of the max log-probability
        epoch_acc  += epoch_pred.eq(target.view_as(epoch_pred)).sum().item()

    train_loss = epoch_loss / len(train_loader.dataset)
    train_acc  = 100. * epoch_acc / len(train_loader.dataset)
    return train_loss, train_acc 


def test(model, test_loader, epoch):
    model.eval()

    # data-holder
    epoch_loss = 0.
    epoch_acc  = 0.

    # epoch
    with torch.no_grad():
        for bix, (data, target) in enumerate( \
            tqdm(test_loader, desc=' : [test:epoch:{}]'.format(epoch))):

            # TODO - Get the predictions for data using the model

            output = model(data)
            #test_loss += F.nll_loss(output, target, reduction='sum').item()


            epoch_loss += F.cross_entropy(output, target, reduction='sum').item()   # sum up batch loss
            epoch_pred  = output.argmax(dim=1, keepdim=True)                        # get the index of the max log-probability
            epoch_acc  += epoch_pred.eq(target.view_as(epoch_pred)).sum().item()

    test_loss = epoch_loss / len(test_loader.dataset)
    test_acc  = 100. * epoch_acc / len(test_loader.dataset)
    return test_loss, test_acc


def run_traintest(args):
    global _best_acc

    # kwargs
    kwargs = {
        'num_workers': args.num_workers,
    }

    # load the MNIST dataset
    transform=transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.1307,), (0.3081,))])

    train_set = datasets.MNIST('data', train=True, download=True, transform=transform)
    test_set  = datasets.MNIST('data', train=False, download=True, transform=transform)
    train_loader = torch.utils.data.DataLoader(train_set, batch_size=args.batch_size, shuffle=True, **kwargs)
    test_loader  = torch.utils.data.DataLoader(test_set, batch_size=args.batch_size, shuffle=False, **kwargs)

    # load the model and an optimizer
    model = SimpleNet()
    optimizer = optim.Adadelta(model.parameters(), lr=args.lr)
    if args.test:
        assert args.model, "Error: please provide the path to a model file, abort."
        load_data = torch.load(args.model)
        model.load_state_dict(load_data['model'])

    # run training
    if not args.test:

        # : collect the data to store
        train_records = []

        # : record the start time
        start_time = time.time()

        # : run training
        for epoch in range(1, args.epoch+1):
            train_loss, train_acc = train(args, model, train_loader, optimizer, epoch)
            test_loss, test_acc = test(model, test_loader, epoch)
            print (' : Train loss/acc. [{:.2f} / {:.2f}%] | Test loss/acc. [{:.2f} / {:.2f}%]'.format(train_loss, train_acc, test_loss, test_acc))

            # :: collect the data
            train_records.append([epoch, train_loss, train_acc, test_loss, test_acc])

            # :: store the model
            if _best_acc < test_acc:
                store_data = {
                    'param': {
                        'num_workers': args.num_workers,
                        'batch_size': args.batch_size,
                        'epoch': args.epoch,
                        'lr': args.lr
                    },
                    'model': model.state_dict(),
                    'record': train_records
                }
                torch.save(store_data, "mnist_model.pth")
                print (' : Store the best model [{:.2f} -> {:.2f}]'.format(_best_acc, test_acc))
                _best_acc = test_acc

            elapsed = time.time() - start_time
            print (' : Time elapsed to train a model {:.2f} seconds'.format(elapsed))

    # run testing
    else:
        test_loss, test_acc = test(model, test_loader, 'n/a')
        print (' : Test loss/acc. [{:.2f} / {:.2f}%]'.format(test_loss, test_acc))

    # done.


"""
    Main
"""
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Train a Network')

    # parameters (system, hyper-parameters, etc...)
    parser.add_argument('--num-workers', type=int, default=4,
                        help='number of workers (default: 4)')
    parser.add_argument('--model', type=str, default='',
                        help='pre-trained model filepath.')
    parser.add_argument('--batch-size', type=int, default=32,
                        help='input batch size for training (default: 32)')
    parser.add_argument('--epoch', type=int, default=10,
                        help='number of epochs to train (default: 10)')
    parser.add_argument('--lr', type=float, default=0.01,
                        help='learning rate (default: 0.01)')

    # select test mode 
    parser.add_argument('--test', action='store_true', default=False,
                        help='disables CUDA training')

    # execution parameters
    args = parser.parse_args()

    # print out the parameter selection
    print (json.dumps(vars(args), indent=2))
    
    # run training
    run_traintest(args)
    # done.
