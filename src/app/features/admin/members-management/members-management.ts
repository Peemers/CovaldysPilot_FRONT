import {Component, inject, OnInit, signal, TemplateRef, ViewChild} from '@angular/core';
import {UserService} from '../../../shared/services/user';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {CreateUserManuallyRequestDto, CreateUserManuallyResponseDto, UserResponseDto} from '../../../shared/models/user.models';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DatePipe} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-members-management',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    DatePipe,
    MatTooltip,
    MatMenuModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './members-management.html',
  styleUrl: './members-management.scss',
})
export class MembersManagement implements OnInit {
  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder)

  members = signal<UserResponseDto[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);
  temporaryPassword = signal<string | null>(null);

  readonly displayedColumns = ['pseudo', 'firstName', 'email', 'status', 'createdAt', 'actions'];

  addMemberForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    pseudo: ['', [Validators.required, Validators.minLength(3)]],
    birthday: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    isMembershipUpToDate: [false]
  });

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isLoading.set(true);
    this.userService.getAll().subscribe({
      next: (members: UserResponseDto[]) => {
        this.members.set(members);
        this.isLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des membres.', 'Fermer', {duration: 3000});
        this.isLoading.set(false);
      }
    });
  }

  delete(id: string): void {
    if (!window.confirm('Supprimer ce membre définitivement ?')) return;
    this.userService.delete(id).subscribe({
      next: () => {
        this.snackBar.open('Membre supprimé !', 'Fermer', {duration: 3000});
        this.loadMembers();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000});
      }
    });
  }

  exportMembers(filter?: string): void {
    this.userService.exportMembers(filter).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `membres_${filter ?? 'all'}_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'export.', 'Fermer', {duration: 3000});
      }
    });
  }
  @ViewChild('memberDetailDialog') memberDetailDialog!: TemplateRef<unknown>;
  @ViewChild('addMemberDialog') addMemberDialog!: TemplateRef<unknown>;
  @ViewChild('passwordDialog') passwordDialog!: TemplateRef<unknown>;
  private readonly dialog = inject(MatDialog);
  selectedMember = signal<UserResponseDto | null>(null);

  openDetail(member: UserResponseDto): void {
    this.selectedMember.set(member);
    this.dialog.open(this.memberDetailDialog, {
      width: '500px'
    });
  }
  openAddMember(): void {
    this.addMemberForm.reset({isMembershipUpToDate: false});
    this.dialog.open(this.addMemberDialog, {width: '600px'});
  }
  submitAddMember(): void {
    if (!this.addMemberForm.valid) return;

    this.isSubmitting.set(true);
    const dto: CreateUserManuallyRequestDto = this.addMemberForm.value as CreateUserManuallyRequestDto;

    this.userService.addManually(dto).subscribe({
      next: (response: CreateUserManuallyResponseDto) => {
        this.isSubmitting.set(false);
        this.dialog.closeAll();
        this.temporaryPassword.set(response.temporaryPassword);
        this.dialog.open(this.passwordDialog, {width: '400px', disableClose: true});
        this.loadMembers();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.snackBar.open(err.error?.message ?? 'Erreur.', 'Fermer', {duration: 4000});
      }
    });
  }
}
